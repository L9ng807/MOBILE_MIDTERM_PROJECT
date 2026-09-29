export interface SmartphoneProfileInfo {
  brand: string | null;
  manufacturer: string | null;
  modelName: string | null;
  osName: string | null;
  osVersion: string | null;
  isDevice: boolean;
  totalMemoryBytes: number | null;
}

export interface MCUProfileInfo {
  name: string;
  role: string;
  ipAddress: string;
  port: number;
  osVersion: string;
  deploymentLoaded: string;
}

export interface FPGAProfileInfo {
  acceleratorName: string;
  bitstream: string;
  clockMHz: number;
  dmaEngine: string;
  supportedOps: string[];
  precision: string;
}

export interface ResourceUsage {
  label: 'LUT' | 'FF' | 'BRAM' | 'DSP';
  used: number;
  available: number;
}

export interface LatencyBreakdown {
  totalMs: number;
  fpgaWeightedMs: number;
  nonFpgaMs: number;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface DeviceConnectionState {
  state: ConnectionState;
  ipAddress: string;
  port: number;
  lastPingMs: number | null;
  lastError: string | null;
}
