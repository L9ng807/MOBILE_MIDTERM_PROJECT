import type {
  ECGClass,
  ECGRecordData,
} from '../types/ecg';

import {
  MIT_BIH_SAMPLING_RATE,
  MODEL_INPUT_SAMPLES,
} from '../types/ecg';

function gaussian(
  x: number,
  center: number,
  width: number,
  amplitude: number,
) {
  return (
    amplitude *
    Math.exp(
      -Math.pow(x - center, 2) /
        (2 * Math.pow(width, 2)),
    )
  );
}

function generateNBeat(position: number) {
  let value = 0;

  value += gaussian(position, 85, 12, 0.12);
  value += gaussian(position, 145, 5, -0.18);
  value += gaussian(position, 155, 4, 1.0);
  value += gaussian(position, 166, 6, -0.3);
  value += gaussian(position, 220, 20, 0.28);

  return value;
}

function generateLBeat(position: number) {
  let value = 0;

  value += gaussian(position, 82, 13, 0.1);

  value += gaussian(position, 142, 8, -0.12);
  value += gaussian(position, 158, 10, 0.72);
  value += gaussian(position, 181, 13, 0.55);
  value += gaussian(position, 202, 12, -0.35);

  value += gaussian(position, 240, 24, 0.18);

  return value;
}

function generateRBeat(position: number) {
  let value = 0;

  value += gaussian(position, 80, 12, 0.1);

  value += gaussian(position, 144, 6, -0.16);
  value += gaussian(position, 157, 6, 0.75);
  value += gaussian(position, 176, 7, 0.92);
  value += gaussian(position, 194, 9, -0.45);

  value += gaussian(position, 235, 21, 0.2);

  return value;
}

function generateVBeat(position: number) {
  let value = 0;

  value += gaussian(position, 145, 19, 0.82);
  value += gaussian(position, 180, 22, -0.72);
  value += gaussian(position, 235, 24, 0.18);

  return value;
}

function generateABeat(position: number) {
  let value = 0;

  value += gaussian(position, 62, 11, 0.2);

  value += gaussian(position, 132, 5, -0.14);
  value += gaussian(position, 142, 4, 0.92);
  value += gaussian(position, 153, 6, -0.28);

  value += gaussian(position, 205, 18, 0.24);

  return value;
}

function generateHeartbeat(
  label: ECGClass,
  seed: number,
): number[] {
  const samples: number[] = [];

  for (
    let i = 0;
    i < MODEL_INPUT_SAMPLES;
    i += 1
  ) {
    let value = 0;

    if (label === 'N') {
      value = generateNBeat(i);
    } else if (label === 'L') {
      value = generateLBeat(i);
    } else if (label === 'R') {
      value = generateRBeat(i);
    } else if (label === 'V') {
      value = generateVBeat(i);
    } else if (label === 'A') {
      value = generateABeat(i);
    }

    const baseline =
      Math.sin((i + seed) / 45) * 0.018;

    const secondaryBaseline =
      Math.sin((i + seed * 2) / 19) * 0.006;

    samples.push(
      Number(
        (
          value +
          baseline +
          secondaryBaseline
        ).toFixed(6),
      ),
    );
  }

  return samples;
}

export const ecgRecords: ECGRecordData[] = [
  {
    recordId: '100',
    samplingRate: MIT_BIH_SAMPLING_RATE,
    heartRate: 72,
    label: 'N',
    samples: generateHeartbeat('N', 0),
  },
  {
    recordId: '101',
    samplingRate: MIT_BIH_SAMPLING_RATE,
    heartRate: 70,
    label: 'L',
    samples: generateHeartbeat('L', 8),
  },
  {
    recordId: '102',
    samplingRate: MIT_BIH_SAMPLING_RATE,
    heartRate: 74,
    label: 'R',
    samples: generateHeartbeat('R', 15),
  },
  {
    recordId: '103',
    samplingRate: MIT_BIH_SAMPLING_RATE,
    heartRate: 88,
    label: 'V',
    samples: generateHeartbeat('V', 22),
  },
  {
    recordId: '104',
    samplingRate: MIT_BIH_SAMPLING_RATE,
    heartRate: 92,
    label: 'A',
    samples: generateHeartbeat('A', 30),
  },
  {
    recordId: '105',
    samplingRate: MIT_BIH_SAMPLING_RATE,
    heartRate: 68,
    label: 'N',
    samples: generateHeartbeat('N', 40),
  },
];

export function getECGRecord(
  recordId: string,
): ECGRecordData {
  return (
    ecgRecords.find(
      (record) => record.recordId === recordId,
    ) ?? ecgRecords[0]
  );
}