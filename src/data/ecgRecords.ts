export type ECGClass = 'N' | 'S' | 'V' | 'F';

export interface ECGRecordData {
  recordId: string;
  samplingRate: number;
  heartRate: number;
  label: ECGClass;
  samples: number[];
}

const BEAT_SIZE = 80;
const TOTAL_SAMPLES = 320;

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

function generateNormalBeat(position: number) {
  let value = 0;

  value += gaussian(position, 14, 4, 6);    // P
  value += gaussian(position, 30, 1.5, -12); // Q
  value += gaussian(position, 33, 1.2, 65);  // R
  value += gaussian(position, 36, 1.5, -20); // S
  value += gaussian(position, 55, 7, 15);    // T

  return value;
}

function generateSBeat(position: number) {
  let value = 0;

  value += gaussian(position, 10, 3, 4);
  value += gaussian(position, 26, 1.4, -8);
  value += gaussian(position, 29, 1.1, 55);
  value += gaussian(position, 32, 1.3, -16);
  value += gaussian(position, 48, 6, 12);

  return value;
}

function generateVBeat(position: number) {
  let value = 0;

  value += gaussian(position, 29, 5, 50);
  value += gaussian(position, 38, 6, -38);
  value += gaussian(position, 58, 8, 10);

  return value;
}

function generateFBeat(position: number) {
  const normal = generateNormalBeat(position);
  const ventricular = generateVBeat(position);

  return normal * 0.55 + ventricular * 0.45;
}

function generateECG(
  label: ECGClass,
  seed: number,
): number[] {
  const samples: number[] = [];

  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const position = i % BEAT_SIZE;

    let value = 0;

    if (label === 'N') {
      value = generateNormalBeat(position);
    }

    if (label === 'S') {
      value = generateSBeat(position);
    }

    if (label === 'V') {
      value = generateVBeat(position);
    }

    if (label === 'F') {
      value = generateFBeat(position);
    }

    const baseline =
      Math.sin((i + seed) / 45) * 1.5;

    samples.push(value + baseline);
  }

  return samples;
}

export const ecgRecords: ECGRecordData[] = [
  {
    recordId: '100',
    samplingRate: 360,
    heartRate: 72,
    label: 'N',
    samples: generateECG('N', 0),
  },
  {
    recordId: '101',
    samplingRate: 360,
    heartRate: 75,
    label: 'N',
    samples: generateECG('N', 8),
  },
  {
    recordId: '102',
    samplingRate: 360,
    heartRate: 96,
    label: 'S',
    samples: generateECG('S', 15),
  },
  {
    recordId: '103',
    samplingRate: 360,
    heartRate: 88,
    label: 'V',
    samples: generateECG('V', 22),
  },
  {
    recordId: '104',
    samplingRate: 360,
    heartRate: 69,
    label: 'N',
    samples: generateECG('N', 30),
  },
  {
    recordId: '105',
    samplingRate: 360,
    heartRate: 84,
    label: 'F',
    samples: generateECG('F', 40),
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