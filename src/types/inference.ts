import type {
  ECGClass,
} from './ecg';

import type {
  CandidateInfo,
} from './model';

export interface InferenceBeatPayload {
  index: number;

  label?: ECGClass;

  samples: number[];
}

export interface SoftwareInferenceRequest {
  candidate_id: number;

  beat: InferenceBeatPayload;
}

export interface BackendPredictionResult {
  backend: string;

  predicted_class: ECGClass;

  confidence: number;

  probabilities: Record<
    ECGClass,
    number
  >;

  latency_ms: number;

  model_path: string;
}

export interface BackendInferenceResult
  extends BackendPredictionResult {
  candidate: CandidateInfo;
}

export interface SoftwareInferenceResponse {
  ok: boolean;

  result?: BackendInferenceResult;

  error?: string;
}

export interface InferenceDisplayResult {
  backend: string;

  predictedClass: ECGClass;

  confidencePercent: number;

  probabilitiesPercent: Record<
    ECGClass,
    number
  >;

  latencyMs: number;

  modelPath: string;

  candidate: CandidateInfo;
}

export interface SoftwareComparisonRequest {
  beat: InferenceBeatPayload;
}

export interface SoftwareComparisonSuccessRow {
  candidate: CandidateInfo;

  result: BackendPredictionResult;

  ok: true;
}

export interface SoftwareComparisonErrorRow {
  candidate: CandidateInfo;

  ok: false;

  error: string;
}

export type SoftwareComparisonRow =
  | SoftwareComparisonSuccessRow
  | SoftwareComparisonErrorRow;

export interface SoftwareComparisonResponse {
  ok: boolean;

  mode: string;

  rows: SoftwareComparisonRow[];
}