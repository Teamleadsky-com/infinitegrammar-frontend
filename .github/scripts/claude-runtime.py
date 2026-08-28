#!/usr/bin/env python3
"""Claude Code runtime helpers for resumable GitHub Actions executions.

This script deliberately persists only the selected Claude session transcript,
its optional subagent sidecars, and the action execution stream. It never
copies ~/.claude wholesale, so credentials/configuration are not placed in
workflow artifacts.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import pathlib
import re
import shutil
import sys
from typing import Any, Iterable

UTC = dt.timezone.utc
SESSION_ID_RE = re.compile(
    r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
)
RATE_LIMIT_RE = re.compile(
    r"(?:you(?:'|’)ve\s+hit\s+your\s+(?:session|weekly|opus)\s+limit|"
    r"\b(?:session|weekly|opus|usage|rate)\s+limit(?:\s+(?:reached|hit|exceeded))?\b|"
    r"\btoo\s+many\s+requests\b|\bquota\s+(?:exceeded|exhausted)\b)",
    re.IGNORECASE,
)
ISO_RE = re.compile(
    r"\b20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})\b"
)
CLOCK_RESET_RE = re.compile(
    r"\bresets\s+(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+)?"
    r"(\d{1,2}):(\d{2})\s*(am|pm)"
    r"(?:\s*\((UTC|GMT)\))?",
    re.IGNORECASE,
)
WEEKDAYS = {"mon": 0, "tue": 1, "wed": 2, "thu": 3, "fri": 4, "sat": 5, "sun": 6}


def _load_events(path_value: str) -> list[dict[str, Any]]:
    path_value = str(path_value or "").strip()
    if not path_value:
        return []
    path = pathlib.Path(path_value)
    if not path.exists():
        return []
    raw = path.read_text(encoding="utf-8", errors="replace")
    try:
        data = json.loads(raw)
        if isinstance(data, list):
            return [item for item in data if isinstance(item, dict)]
        if isinstance(data, dict):
            return [data]
    except json.JSONDecodeError:
        pass
    events: list[dict[str, Any]] = []
    for line in raw.splitlines():
        try:
            item = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(item, dict):
            events.append(item)
    return events


def _as_epoch_seconds(value: Any) -> int | None:
    try:
        n = float(value)
    except (TypeError, ValueError):
        return None
    if n <= 0:
        return None
    if n > 10_000_000_000:  # tolerate milliseconds
        n /= 1000.0
    return int(n)


def _iso_from_epoch(epoch: int | None) -> str:
    if not epoch:
        return ""
    return dt.datetime.fromtimestamp(epoch, tz=UTC).isoformat().replace("+00:00", "Z")


def _parse_text_reset(text: str, now: dt.datetime) -> tuple[int | None, str]:
    for match in ISO_RE.findall(text):
        try:
            parsed = dt.datetime.fromisoformat(match.replace("Z", "+00:00"))
        except ValueError:
            continue
        if parsed.tzinfo is None:
            continue
        epoch = int(parsed.timestamp())
        if epoch > int(now.timestamp()):
            return epoch, _iso_from_epoch(epoch)

    match = CLOCK_RESET_RE.search(text)
    if not match:
        return None, ""
    weekday_text, hour_text, minute_text, meridiem, timezone_text = match.groups()
    # Do not guess a timezone for human-readable reset strings.
    if not timezone_text or timezone_text.upper() not in {"UTC", "GMT"}:
        return None, ""

    hour = int(hour_text)
    minute = int(minute_text)
    if hour < 1 or hour > 12 or minute > 59:
        return None, ""
    if meridiem.lower() == "am":
        hour = 0 if hour == 12 else hour
    else:
        hour = 12 if hour == 12 else hour + 12

    candidate = now.astimezone(UTC).replace(hour=hour, minute=minute, second=0, microsecond=0)
    if weekday_text:
        target = WEEKDAYS[weekday_text.lower()[:3]]
        days = (target - candidate.weekday()) % 7
        candidate += dt.timedelta(days=days)
        if candidate <= now:
            candidate += dt.timedelta(days=7)
    elif candidate <= now:
        candidate += dt.timedelta(days=1)

    epoch = int(candidate.timestamp())
    return epoch, _iso_from_epoch(epoch)


def _error_texts(events: Iterable[dict[str, Any]]) -> list[str]:
    texts: list[str] = []
    for item in events:
        subtype = str(item.get("subtype") or "").strip().lower()
        is_error = bool(item.get("is_error")) or subtype.startswith("error_")
        typ = str(item.get("type") or "").strip().lower()
        if typ == "rate_limit_event":
            continue
        candidates: list[Any] = []
        if is_error or typ == "result":
            candidates.extend([item.get("result"), item.get("message"), item.get("error")])
        error_obj = item.get("error")
        if isinstance(error_obj, dict):
            candidates.extend([error_obj.get("message"), error_obj.get("description")])
        for value in candidates:
            if isinstance(value, str) and value.strip():
                texts.append(value.strip())
    return texts


def classify(execution_file: str, max_turns: int) -> dict[str, Any]:
    events = _load_events(execution_file)
    result = ""
    turns = 0
    last_subtype = ""
    terminal_subtype = ""
    session_id = ""
    rate_limit_status = ""
    rate_limit_type = ""
    reset_epoch: int | None = None
    diagnostic_text = ""

    for item in events:
        subtype = str(item.get("subtype") or "").strip()
        if subtype:
            last_subtype = subtype
        if subtype == "error_max_turns":
            terminal_subtype = subtype

        try:
            candidate_turns = int(item.get("num_turns") or 0)
        except (TypeError, ValueError):
            candidate_turns = 0
        turns = max(turns, candidate_turns)

        candidate_session = str(item.get("session_id") or "").strip()
        if candidate_session and SESSION_ID_RE.match(candidate_session):
            session_id = candidate_session

        if str(item.get("type") or "").strip() == "rate_limit_event":
            info = item.get("rate_limit_info") or {}
            if isinstance(info, dict):
                status = str(info.get("status") or "").strip().lower()
                if status:
                    rate_limit_status = status
                raw_type = info.get("rateLimitType", info.get("rate_limit_type", ""))
                if raw_type:
                    rate_limit_type = str(raw_type).strip()
                epoch = _as_epoch_seconds(info.get("resetsAt", info.get("resets_at")))
                if epoch:
                    reset_epoch = epoch
            if rate_limit_status == "rejected" and candidate_session:
                session_id = candidate_session

        is_result_event = item.get("type") == "result" or len(events) == 1
        if is_result_event:
            candidate_result = str(item.get("result") or "")
            is_error_result = bool(item.get("is_error")) or subtype.startswith("error_")
            if candidate_result.strip() and not is_error_result:
                result = candidate_result

    error_texts = _error_texts(events)
    joined_error = "\n".join(error_texts)
    if error_texts:
        diagnostic_text = error_texts[-1][:1500]

    rate_limited = rate_limit_status == "rejected"
    if not rate_limited and RATE_LIMIT_RE.search(joined_error):
        rate_limited = True
        rate_limit_status = rate_limit_status or "rejected"

    if rate_limited and not reset_epoch:
        reset_epoch, _ = _parse_text_reset(joined_error, dt.datetime.now(tz=UTC))

    reset_at = _iso_from_epoch(reset_epoch)

    if result.strip():
        error_type = ""
    elif rate_limited:
        error_type = "claude_rate_limit"
    elif terminal_subtype == "error_max_turns" or turns >= max_turns:
        error_type = "turn_limit_exhausted"
    else:
        error_type = "claude_execution_error"

    return {
        "result": result,
        "turns": turns,
        "subtype": terminal_subtype or last_subtype,
        "error_type": error_type,
        "rate_limit_status": rate_limit_status,
        "rate_limit_type": rate_limit_type,
        "reset_at_epoch": reset_epoch or 0,
        "reset_at": reset_at,
        "session_id": session_id,
        "diagnostic_text": diagnostic_text,
        "event_count": len(events),
    }


def _write_github_outputs(path: str, values: dict[str, Any]) -> None:
    if not path:
        return
    output = pathlib.Path(path)
    with output.open("a", encoding="utf-8") as fh:
        for key in (
            "error_type",
            "rate_limit_status",
            "rate_limit_type",
            "reset_at_epoch",
            "reset_at",
            "session_id",
            "turns",
            "subtype",
        ):
            value = str(values.get(key) or "")
            # These fields are deliberately single-line.
            value = value.replace("\r", " ").replace("\n", " ")
            fh.write(f"{key}={value}\n")


def package_session(session_id: str, output_dir: str, execution_file: str = "") -> dict[str, Any]:
    if not SESSION_ID_RE.match(session_id):
        raise SystemExit("Invalid Claude session_id")
    root = pathlib.Path.home() / ".claude" / "projects"
    if not root.exists():
        raise SystemExit("Claude projects directory does not exist")
    matches = sorted(root.rglob(f"{session_id}.jsonl"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not matches:
        raise SystemExit(f"Claude transcript for session {session_id} was not found")
    transcript = matches[0]
    out = pathlib.Path(output_dir)
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True, exist_ok=True)
    shutil.copy2(transcript, out / "main.jsonl")

    sidecar_root = transcript.parent / session_id
    if sidecar_root.exists() and sidecar_root.is_dir():
        shutil.copytree(sidecar_root, out / "session-sidecars")

    execution_path = pathlib.Path(str(execution_file or "").strip()) if execution_file else None
    if execution_path and execution_path.exists() and execution_path.is_file():
        shutil.copy2(execution_path, out / "execution-output.json")

    metadata = {
        "session_id": session_id,
        "source_transcript": str(transcript),
        "source_project_key": transcript.parent.name,
        "source_cwd": os.getcwd(),
        "packaged_at": dt.datetime.now(tz=UTC).isoformat().replace("+00:00", "Z"),
    }
    (out / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return metadata


def _project_key(cwd: str) -> str:
    # Claude Code stores project transcripts using the absolute cwd with every
    # non-alphanumeric character replaced by '-'.
    return re.sub(r"[^A-Za-z0-9]", "-", cwd)


def restore_session(session_id: str, input_dir: str) -> pathlib.Path:
    if not SESSION_ID_RE.match(session_id):
        raise SystemExit("Invalid Claude session_id")
    source = pathlib.Path(input_dir)
    main = source / "main.jsonl"
    if not main.exists():
        raise SystemExit("Session artifact is missing main.jsonl")
    target_dir = pathlib.Path.home() / ".claude" / "projects" / _project_key(os.getcwd())
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / f"{session_id}.jsonl"
    shutil.copy2(main, target)

    sidecars = source / "session-sidecars"
    if sidecars.exists() and sidecars.is_dir():
        target_sidecars = target_dir / session_id
        if target_sidecars.exists():
            shutil.rmtree(target_sidecars)
        shutil.copytree(sidecars, target_sidecars)
    return target


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    p_classify = sub.add_parser("classify")
    p_classify.add_argument("--execution-file", default="")
    p_classify.add_argument("--max-turns", type=int, required=True)
    p_classify.add_argument("--json-output", required=True)
    p_classify.add_argument("--github-output", default="")

    p_package = sub.add_parser("package")
    p_package.add_argument("--session-id", required=True)
    p_package.add_argument("--output-dir", required=True)
    p_package.add_argument("--execution-file", default="")

    p_restore = sub.add_parser("restore")
    p_restore.add_argument("--session-id", required=True)
    p_restore.add_argument("--input-dir", required=True)

    args = parser.parse_args()
    if args.command == "classify":
        values = classify(args.execution_file, args.max_turns)
        pathlib.Path(args.json_output).write_text(json.dumps(values), encoding="utf-8")
        _write_github_outputs(args.github_output, values)
        print(json.dumps({k: v for k, v in values.items() if k != "result"}, indent=2))
        return 0
    if args.command == "package":
        print(json.dumps(package_session(args.session_id, args.output_dir, args.execution_file), indent=2))
        return 0
    if args.command == "restore":
        print(str(restore_session(args.session_id, args.input_dir)))
        return 0
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
