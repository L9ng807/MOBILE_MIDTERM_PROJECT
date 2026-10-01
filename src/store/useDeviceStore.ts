import { create } from 'zustand';
import { ConnectionState } from '../types/device';

interface DeviceStoreState {
  state: ConnectionState;
  ipAddress: string;
  port: number;
  lastPingMs: number | null;
  lastError: string | null;
  setIpAddress: (ip: string) => void;
  setPort: (port: number) => void;
  setState: (state: ConnectionState) => void;
  setPing: (ms: number | null) => void;
  setError: (message: string | null) => void;
}

export const useDeviceStore = create<DeviceStoreState>((set) => ({
  state: 'disconnected',
  ipAddress: '192.168.2.99',
  port: 9000,
  lastPingMs: null,
  lastError: null,
  setIpAddress: (ipAddress) => set({ ipAddress }),
  setPort: (port) => set({ port }),
  setState: (state) => set({ state }),
  setPing: (lastPingMs) => set({ lastPingMs }),
  setError: (lastError) => set({ lastError }),
}));
