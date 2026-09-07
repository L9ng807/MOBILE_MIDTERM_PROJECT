import { create } from 'zustand';
import { InferenceResult, FPGAStatus } from '../types/ecg';

type ExecutionMode = 'mobile' | 'fpga' | 'adaptive';

interface AppState {
  isRunning: boolean;
  executionMode: ExecutionMode;
  latestResult: InferenceResult | null;
  fpgaStatus: FPGAStatus | null;
  setRunning: (v: boolean) => void;
  setExecutionMode: (m: ExecutionMode) => void;
  setLatestResult: (r: InferenceResult) => void;
  setFpgaStatus: (s: FPGAStatus) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isRunning: false,
  executionMode: 'adaptive',
  latestResult: null,
  fpgaStatus: null,
  setRunning: (v) => set({ isRunning: v }),
  setExecutionMode: (m) => set({ executionMode: m }),
  setLatestResult: (r) => set({ latestResult: r }),
  setFpgaStatus: (s) => set({ fpgaStatus: s }),
}));