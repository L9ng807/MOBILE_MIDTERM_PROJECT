import type {
  ECGSegment,
  InferenceResult,
  PerformanceMetrics,
  FPGAStatus,
  ModelInfo,
} from '../types/ecg';

import {
  MIT_BIH_SAMPLING_RATE,
  MODEL_INPUT_SAMPLES,
} from '../types/ecg';

export function generateMockECGSegment(): ECGSegment {
  const samples =
    Array.from(
      {
        length:
          MODEL_INPUT_SAMPLES,
      },

      (_, i) =>
        Math.sin(i / 14) *
          0.5 +
        Math.sin(i / 5) *
          0.08,
    );

  return {
    timestamp: Date.now(),

    samples,

    sampleRate:
      MIT_BIH_SAMPLING_RATE,
  };
}

export function generateMockInference(): InferenceResult {
  const probabilitySets: InferenceResult['probabilities'][] =
    [
      {
        N: 94.5,
        L: 1.7,
        R: 1.4,
        V: 1.5,
        A: 0.9,
      },

      {
        N: 2.1,
        L: 92.8,
        R: 2.3,
        V: 1.7,
        A: 1.1,
      },

      {
        N: 2.0,
        L: 2.4,
        R: 92.5,
        V: 1.8,
        A: 1.3,
      },

      {
        N: 1.8,
        L: 1.5,
        R: 1.9,
        V: 93.7,
        A: 1.1,
      },

      {
        N: 2.4,
        L: 1.6,
        R: 1.7,
        V: 1.5,
        A: 92.8,
      },
    ];

  const probabilities =
    probabilitySets[
      Math.floor(
        Math.random() *
          probabilitySets.length,
      )
    ];

  const classNames =
    Object.keys(
      probabilities,
    ) as InferenceResult['predictedClass'][];

  const predictedClass =
    classNames.reduce(
      (
        highestClass,
        currentClass,
      ) =>
        probabilities[
          currentClass
        ] >
        probabilities[
          highestClass
        ]
          ? currentClass
          : highestClass,
    );

  return {
    predictedClass,

    confidence:
      probabilities[
        predictedClass
      ],

    probabilities,

    device: 'mobile',

    latencyMs:
      15 +
      Math.random() * 10,

    rrFeatures: {
      rrPrevious: 0.82,
      rrNext: 0.79,
      rrLocalMean: 0.8,
      rrRatio: 1.03,
    },
  };
}

export const mockPerformance: PerformanceMetrics[] =
  [
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

export const mockFPGAStatus: FPGAStatus =
  {
    connected: true,

    ipAddress:
      '192.168.1.20',

    pingMs: 4,

    modelLoaded:
      'NAS-ECG-v3',

    acceleratorReady: true,
  };

export const mockModelInfo: ModelInfo =
  {
    name: 'NAS-ECG-v3',

    layers: 12,

    operators: [
      'Conv1D',
      'DSConv1D',
    ],

    precision: 'MIXED',

    paramsK: 214,

    modelSizeKB: 820,
  };