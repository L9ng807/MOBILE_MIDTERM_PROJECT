export const ECG_CLASSES = [
  'N',
  'L',
  'R',
  'V',
  'A',
] as const;

export type ECGClass = (typeof ECG_CLASSES)[number];

export const ECG_CLASS_NAMES: Record<ECGClass, string> = {
  N: 'Normal',
  L: 'Left Bundle Branch Block',
  R: 'Right Bundle Branch Block',
  V: 'Premature Ventricular Contraction',
  A: 'Atrial Premature Beat',
};

export const MIT_BIH_SAMPLING_RATE = 360;

export const MODEL_INPUT_SAMPLES = 320;

export type ECGInputSource =
  | 'sample'
  | 'dataset'
  | 'upload';

export type DatasetSplit =
  | 'train'
  | 'val'
  | 'test';

export interface ECGSegment {
  timestamp: number;
  samples: number[];
  sampleRate: number;
}

export interface ECGBeat {
  index: number;
  label?: ECGClass;
  start?: number;
  end?: number;
  points?: number[];
  samples: number[];
}

export interface ECGRecordData {
  recordId: string;
  samplingRate: number;
  heartRate?: number;
  label: ECGClass;
  samples: number[];
}

export interface ECGRecordSummary {
  record_id: string;
  split: DatasetSplit;
  beat_count: number;
  class_counts: Record<ECGClass, number>;
}

export interface ECGRecordResponse {
  record_id: string;
  split: DatasetSplit;
  beat_count: number;
  beats_loaded: number;
  truncated: boolean;
  class_counts: Record<ECGClass, number>;
  beats: ECGBeat[];
  source: string;
}

export interface ECGRecordsResponse {
  source: string;
  records: ECGRecordSummary[];
}

export interface UploadedECGFile {
  name: string;
  uri: string;
  samplingRate: number;
  samples: number[];
}

export interface ECGInferenceInput {
  recordId: string;
  beatIndex: number;
  samplingRate: number;
  samples: number[];
  inputSource: ECGInputSource;
  referenceLabel?: ECGClass;
  split?: DatasetSplit;
}

export interface InferenceResult {
  predictedClass: ECGClass;
  confidence: number;
  probabilities: Record<ECGClass, number>;
  device: 'mobile' | 'fpga';
  latencyMs: number;
  rrFeatures: {
    rrPrevious: number;
    rrNext: number;
    rrLocalMean: number;
    rrRatio: number;
  };
}

export interface ModelInfo {
  name: string;
  layers: number;
  operators: string[];
  precision: 'INT4' | 'INT8' | 'FP16' | 'MIXED';
  paramsK: number;
  modelSizeKB: number;
}

export interface PerformanceMetrics {
  device: 'mobile' | 'fpga';
  latencyMs: number;
  throughputBeatsPerSec: number;
  modelSizeKB?: number;
  power?: number;
  lut?: number;
  ff?: number;
  dsp?: number;
  bram?: number;
}

export interface FPGAStatus {
  connected: boolean;
  ipAddress: string;
  pingMs: number;
  modelLoaded: string;
  acceleratorReady: boolean;
}