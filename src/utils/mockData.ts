import {
  ECGSegment,
  InferenceResult,
  PerformanceMetrics,
  FPGAStatus,
  ModelInfo,
} from '../types/ecg';

export function generateMockECGSegment(): ECGSegment {
  const samples = Array.from(
    { length: 250 },
    (_, i) => Math.sin(i / 8) * 50 + (Math.random() - 0.5) * 10,
  );

  return {
    timestamp: Date.now(),
    samples,
    sampleRate: 250,
  };
}

export function generateMockInference(): InferenceResult {
  const probabilitySets: InferenceResult['probabilities'][] = [
    { N: 94.5, S: 1.8, V: 2.2, F: 1.5 },
    { N: 3.1, S: 92.8, V: 2.4, F: 1.7 },
    { N: 2.1, S: 1.7, V: 94.2, F: 2.0 },
    { N: 3.0, S: 2.0, V: 4.0, F: 91.0 },
  ];

  const probabilities =
    probabilitySets[Math.floor(Math.random() * probabilitySets.length)];

  const classNames = Object.keys(
    probabilities,
  ) as InferenceResult['predictedClass'][];

  const predictedClass = classNames.reduce((highestClass, currentClass) =>
    probabilities[currentClass] > probabilities[highestClass]
      ? currentClass
      : highestClass,
  );

  return {
    predictedClass,
    confidence: probabilities[predictedClass],
    probabilities,
    device: 'mobile',
    latencyMs: 15 + Math.random() * 10,
    rrFeatures: {
      rrPrevious: 0.82,
      rrNext: 0.79,
      rrLocalMean: 0.8,
      rrRatio: 1.03,
    },
  };
}

export const mockPerformance: PerformanceMetrics[] = [
  {
    device: 'mobile',
    latencyMs: 18.4,
    throughputBeatsPerSec: 54,
    modelSizeKB: 820,
  },
  {
    device: 'fpga',
    latencyMs: 2.7,
    throughputBeatsPerSec: 370,
    lut: 42,
    ff: 30,
    dsp: 18,
    bram: 25,
  },
];

export const mockFPGAStatus: FPGAStatus = {
  connected: true,
  ipAddress: '192.168.1.20',
  pingMs: 4,
  modelLoaded: 'NAS-ECG-v3',
  acceleratorReady: true,
};

export const mockModelInfo: ModelInfo = {
  name: 'NAS-ECG-v3',
  layers: 12,
  operators: ['Conv1D', 'DSConv1D'],
  precision: 'MIXED',
  paramsK: 214,
  modelSizeKB: 820,
};