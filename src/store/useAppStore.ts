import { create } from 'zustand';

import type {
  ECGInferenceInput,
  FPGAStatus,
  InferenceResult,
} from '../types/ecg';

type ExecutionMode =
  | 'mobile'
  | 'fpga'
  | 'adaptive';

interface AppState {
  isRunning: boolean;

  executionMode: ExecutionMode;

  latestResult:
    | InferenceResult
    | null;

  fpgaStatus:
    | FPGAStatus
    | null;

  selectedECG:
    | ECGInferenceInput
    | null;

  setRunning: (
    value: boolean,
  ) => void;

  setExecutionMode: (
    mode: ExecutionMode,
  ) => void;

  setLatestResult: (
    result: InferenceResult,
  ) => void;

  setFpgaStatus: (
    status: FPGAStatus,
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
      isRunning: false,

      executionMode:
        'adaptive',

      latestResult: null,

      fpgaStatus: null,

      selectedECG: null,

      setRunning:
        (value) =>
          set({
            isRunning:
              value,
          }),

      setExecutionMode:
        (mode) =>
          set({
            executionMode:
              mode,
          }),

      setLatestResult:
        (result) =>
          set({
            latestResult:
              result,
          }),

      setFpgaStatus:
        (status) =>
          set({
            fpgaStatus:
              status,
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