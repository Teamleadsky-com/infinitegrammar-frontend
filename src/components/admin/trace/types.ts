import type { TraceExercise } from "@/lib/pipelineTrace";

export type TraceRun = {
  runId: string;
  kind: string;
  config: string | null;
  verifierVersion: string | null;
  mode: string | null;
  status: string | null;
  requested: number | null;
  attempts: number | null;
  accepted: number | null;
  rejected: number | null;
  unfinished: number | null;
  spentUsd: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  durationSeconds: number | null;
  yieldPct: number | null;
  requestedMetPct: number | null;
  usdPerAccepted: number | null;
  stageDefsSnapshot: boolean | null;
};

type Usage = {
  calls: number;
  inputTokens: number | null;
  outputTokens: number | null;
  reasoningTokens: number | null;
  costUsd: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  spanSeconds: number | null;
  callSeconds: number | null;
};

export type TraceStage = Usage & {
  stage: string;
  stageLabel: string;
  stageOrder: number;
  nIn: number;
  nPassed: number;
  nFailed: number;
  nOther: number;
  nPassedFirstTry: number;
  nPassedAfterRetry: number;
  maxIterationUsed: number;
};

export type TraceIteration = Usage & {
  stage: string;
  iteration: number;
  nIn: number;
  nPassed: number;
  nRetry: number;
  nFailed: number;
  nOther: number;
  models: string[];
};

export type TraceIssue = {
  stage: string;
  iteration: number;
  issueCode: string;
  issueLabel: string;
  nRetry: number;
  nFailed: number;
  n: number;
};

export type StageDef = {
  stage: string;
  stageOrder: number;
  maxIterations: number;
  component: string;
  componentOrder: number;
  kind: "llm" | "rules";
  model: string | null;
  settings: Record<string, unknown>;
  promptId: string | null;
  promptText: string | null;
  rulesText: string | null;
  applies: string | null;
  snapshot: boolean;
};

export type TraceData = {
  stages: TraceStage[];
  iterations: TraceIteration[];
  issues: TraceIssue[];
  stageDefs: StageDef[];
  issueLabels: Record<string, string>;
};

export type AttemptRow = {
  attemptId: string;
  sectionId: string | null;
  sectionName: string | null;
  level: string | null;
  contentTopic: string | null;
  scene: string | null;
  status: string;
  issueCodes: string[];
  exerciseId: string | null;
  steps: number;
  calls: number;
  costUsd: number | null;
  callSeconds: number | null;
  verdict: string | null;
  stepIssueCodes: string[] | null;
  stepCostUsd: number | null;
  iteration: number | null;
};

/** Which attempts a count stands for (query of /api/admin-pipeline-trace-attempts). */
export type AttemptQuery = {
  title: string;
  stage: string;
  iteration: number | "last";
  verdicts?: string[];
  minIteration?: number;
};

export type TraceStep = {
  stage: string;
  stageOrder: number;
  iteration: number;
  stepOrder: number;
  verdict: string;
  issueCodes: string[];
  feedback: string | null;
  details: Record<string, unknown>;
  inputVersion: string | null;
  outputVersion: string | null;
  models: string[];
  calls: number;
  inputTokens: number | null;
  outputTokens: number | null;
  reasoningTokens: number | null;
  costUsd: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  callSeconds: number | null;
};

export type AttemptDetail = {
  attempt: {
    attemptId: string;
    runKind: string;
    sectionId: string | null;
    sectionName: string | null;
    level: string | null;
    contentTopic: string | null;
    scene: string | null;
    status: string;
    issueCodes: string[];
    firstVersion: string | null;
    finalVersion: string | null;
    exerciseId: string | null;
    steps: number;
    calls: number;
    costUsd: number | null;
    startedAt: string | null;
    finishedAt: string | null;
    callSeconds: number | null;
    details: Record<string, unknown>;
  };
  steps: TraceStep[];
  versions: Record<string, TraceExercise>;
};
