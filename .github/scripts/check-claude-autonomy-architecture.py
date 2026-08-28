#!/usr/bin/env python3
"""Fail closed if an autonomous Claude GitHub workflow bypasses the queue runtime contract."""
from __future__ import annotations
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
WORKFLOWS = ROOT / ".github" / "workflows"

ACTION_MARKER = "anthropics/claude-code-action@"

AUTONOMOUS_ALLOWED = {
    "claude-assessment.yml",
    "claude-experiment.yml",
}

INTERACTIVE_ALLOWED = {
    "claude.yml",
}

RUNTIME_REQUIREMENTS = (
    "workflow_dispatch:",
    "task_id:",
    "resume_session_id:",
    "resume_source_run_id:",
    "resume_artifact_name:",
    "resume_generation:",
    ".github/scripts/claude-runtime.py classify",
    "actions/upload-artifact@v4",
    "--resume",
    "error_type: claude_rate_limit",
    "outcome: paused",
)


def fail(message: str) -> None:
    raise SystemExit(
        f"Claude autonomy architecture violation: {message}"
    )


def main() -> int:
    action_workflows = []

    for path in sorted(
        [
            *WORKFLOWS.glob("*.yml"),
            *WORKFLOWS.glob("*.yaml"),
        ]
    ):
        text = path.read_text(encoding="utf-8")

        if ACTION_MARKER not in text:
            continue

        action_workflows.append(path.name)

        if path.name in INTERACTIVE_ALLOWED:
            if "workflow_dispatch:" in text:
                fail(
                    f"interactive workflow {path.name} must not "
                    "become an autonomous workflow_dispatch path"
                )

            if not any(
                trigger in text
                for trigger in (
                    "issue_comment:",
                    "pull_request_review_comment:",
                    "pull_request_review:",
                )
            ):
                fail(
                    f"interactive workflow {path.name} no longer "
                    "has an explicit interactive trigger"
                )

            continue

        if path.name not in AUTONOMOUS_ALLOWED:
            fail(
                f"{path.name} invokes claude-code-action outside "
                "the approved queue-backed runtime workflows"
            )

        missing = [
            requirement
            for requirement in RUNTIME_REQUIREMENTS
            if requirement not in text
        ]

        if missing:
            fail(
                f"{path.name} is missing runtime contract markers: "
                f"{missing}"
            )

    missing = sorted(
        AUTONOMOUS_ALLOWED - set(action_workflows)
    )

    if missing:
        fail(
            "approved autonomous Claude workflow(s) missing: "
            f"{missing}"
        )

    unexpected = sorted(
        set(action_workflows)
        - AUTONOMOUS_ALLOWED
        - INTERACTIVE_ALLOWED
    )

    if unexpected:
        fail(
            "unexpected Claude action workflow(s): "
            f"{unexpected}"
        )

    print(
        "PASS: autonomous Claude workflow architecture "
        "is queue-runtime constrained"
    )

    return 0


if __name__ == "__main__":
    sys.exit(main())
