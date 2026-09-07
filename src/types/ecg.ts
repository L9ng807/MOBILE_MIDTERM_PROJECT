export interface ECGSegment {
  timestamp: number;
  samples: number[];
  sampleRate: number;
}

export type ECGClass = 'N' | 'S' | 'V' | 'F';

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