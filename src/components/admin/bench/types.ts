export type BenchRun = {
  runId: string;
  config: string | null;
  tag: string | null;
  dataset: string | null;
  subset: string | null;
  status: string | null;
  mode: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  items: number;
  done: number;
  planted: number;
  caught: number;
  caughtExpected: number;
  clean: number;
  falseRejects: number;
  detectionPct: number | null;
  falseRejectPct: number | null;
  balancedAccuracyPct: number | null;
  precisionSetPct: number | null;
  precisionAt20Pct: number | null;
  precisionAt50Pct: number | null;
  usdPerItem: number | null;
  secondsPerItem: number | null;
  spentUsd: number | null;
  models: string[];
  finalGateModel: string | null;
};

/** One run's result for one planted type (or clean): rejected = TP for a planted type, FP for clean. */
export type BenchTypeMetric = {
  type: string;
  label: string;
  order: number;
  n: number;
  rejected: number;
  rejectedPct: number | null;
  rejectedExpected: number;
  nWithGap: number;
  atGap: number;
};

export type BenchItemRow = {
  attemptId: string;
  parentId: string | null;
  subset: string | null;
  sectionId: string | null;
  level: string | null;
  plantedType: string;
  plantedVariant: string | null;
  plantedAuthor: string | null;
  seenInCalibration: boolean | null;
  cleanSource: string | null;
  status: string;
  rejected: boolean;
  done: boolean;
  flaggedStages: string[];
  flaggedCodes: string[];
  expectedHit: boolean | null;
  atGap: boolean | null;
  costUsd: number | null;
  callSeconds: number | null;
  wallSeconds: number | null;
};

/** One run's result for one stage (v_bench_stage_metrics): own = the flawed items of the types the stage targets. */
export type BenchStageMetric = {
  stage: string;
  label: string;
  order: number;
  plantedN: number;
  plantedFlagged: number;
  ownN: number;
  ownFlagged: number;
  ownRecallPct: number | null;
  cleanN: number;
  cleanFlagged: number;
  cleanFlaggedPct: number | null;
};
