export interface ECGRecordData {
  recordId: string;
  samplingRate: number;
  heartRate: number;
  label: 'N' | 'S' | 'V' | 'F';
  samples: number[];
}

function generateNormalECG(seed: number): number[] {
  const samples: number[] = [];

  for (let i = 0; i < 320; i++) {
    let value = Math.sin((i + seed) / 12) * 5;

    const position = i % 80;

    if (position === 31) value += 12;
    if (position === 32) value += 30;
    if (position === 33) value += 65;
    if (position === 34) value -= 28;
    if (position === 35) value += 12;

    value += Math.sin((i + seed) / 25) * 3;

    samples.push(value);
  }

  return samples;
}

export const ecgRecords: ECGRecordData[] = [
  {
    recordId: '100',
    samplingRate: 360,
    heartRate: 72,
    label: 'N',
    samples: generateNormalECG(0),
  },
  {
    recordId: '101',
    samplingRate: 360,
    heartRate: 76,
    label: 'N',
    samples: generateNormalECG(8),
  },
  {
    recordId: '102',
    samplingRate: 360,
    heartRate: 81,
    label: 'S',
    samples: generateNormalECG(15),
  },
  {
    recordId: '103',
    samplingRate: 360,
    heartRate: 88,
    label: 'V',
    samples: generateNormalECG(24),
  },
  {
    recordId: '104',
    samplingRate: 360,
    heartRate: 69,
    label: 'N',
    samples: generateNormalECG(32),
  },
  {
    recordId: '105',
    samplingRate: 360,
    heartRate: 84,
    label: 'F',
    samples: generateNormalECG(40),
  },
];

export function getECGRecord(recordId: string) {
  return (
    ecgRecords.find((record) => record.recordId === recordId) ??
    ecgRecords[0]
  );
}