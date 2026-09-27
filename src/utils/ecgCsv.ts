import {
  MODEL_INPUT_SAMPLES,
} from '../types/ecg';

export function parseECGSamples(
  content: string,
): number[] {
  const numericRows = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) =>
      line
        .split(/[,\t;]/)
        .map((cell) => cell.trim())
        .filter(
          (cell) =>
            cell.length > 0,
        )
        .map((cell) =>
          Number(cell),
        )
        .filter((value) =>
          Number.isFinite(value),
        ),
    )
    .filter(
      (row) => row.length > 0,
    );

  if (
    numericRows.length === 1 &&
    numericRows[0].length > 2
  ) {
    return numericRows[0];
  }

  return numericRows.map(
    (row) =>
      row[row.length - 1],
  );
}

export function getCompleteHeartbeatCount(
  samples: number[],
): number {
  return Math.floor(
    samples.length /
      MODEL_INPUT_SAMPLES,
  );
}