import { create } from 'zustand';

import type {
  ECGInferenceInput,
} from '../types/ecg';

export type ExecutionMode =
  | 'mobile'
  | 'fpga'
  | 'adaptive';

interface AppState {
  executionMode: ExecutionMode;

  selectedECG:
    | ECGInferenceInput
    | null;

  setExecutionMode: (
    mode: ExecutionMode,
  ) => void;

  setSelectedECG: (
    input: ECGInferenceInput,
  ) => void;

  clearSelectedECG:
    () => void;
}

export const useAppStore =
  create<AppState>(
    (set) => ({
      executionMode:
        'adaptive',

      selectedECG:
        null,

      setExecutionMode:
        (mode) =>
          set({
            executionMode:
              mode,
          }),

      setSelectedECG:
        (input) =>
          set({
            selectedECG:
              input,
          }),

      clearSelectedECG:
        () =>
          set({
            selectedECG:
              null,
          }),
    }),
  );