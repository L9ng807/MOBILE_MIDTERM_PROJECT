import { MCUProfileInfo, FPGAProfileInfo, ResourceUsage, LatencyBreakdown } from '../types/device';

// These numbers mirror the PYNQ-Z2 / Vivado report values from the project's
// technical summary (section 16 & 17). Replace with values read live from the
// PYNQ /health or /status endpoint once the API-layer teammate exposes them.

export const mockMCUProfile: MCUProfileInfo = {
  name: 'PYNQ-Z2 ARM (PS)',
  role:
    'Điều phối runtime: nhận HTTP request, chuẩn bị layer config, điều khiển AXI DMA, thực hiện GELU/pooling/concat/residual/GAP/GMP.',
  ipAddress: '192.168.2.99',
  port: 9000,
  osVersion: 'PYNQ Linux (Xilinx)',
  deploymentLoaded: 'final_w4a4_p99_9',
};

export const mockFPGAProfile: FPGAProfileInfo = {
  acceleratorName: 'ecg_accelerator',
  bitstream: 'ecg_accelerator.bit',
  clockMHz: 100,
  dmaEngine: 'axi_dma_0',
  supportedOps: ['Conv1D', 'Depthwise Conv1D', 'Pointwise Conv1D', 'Projection'],
  precision: 'INT4 / INT8 mixed precision (W4A4, p99.9 deployment)',
};

export const mockResourceUsage: ResourceUsage[] = [
  { label: 'LUT', used: 18248, available: 53200 },
  { label: 'FF', used: 6536, available: 106400 },
  { label: 'BRAM', used: 2, available: 140 },
  { label: 'DSP', used: 7, available: 220 },
];

export const mockLatencyBreakdown: LatencyBreakdown = {
  totalMs: 690.844,
  fpgaWeightedMs: 69.131,
  nonFpgaMs: 621.714,
};

export interface HealthCheckResult {
  ok: boolean;
  latencyMs: number;
  body?: unknown;
  error?: string;
}

/**
 * Calls the PYNQ runtime's /health endpoint over plain HTTP.
 * The phone and the PYNQ-Z2 board must be on the same Wi-Fi network.
 */
export async function checkPynqHealth(
  ip: string,
  port: number,
  timeoutMs = 4000
): Promise<HealthCheckResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  try {
    const response = await fetch(`http://${ip}:${port}/health`, {
      signal: controller.signal,
    });
    const latencyMs = Date.now() - startedAt;
    clearTimeout(timeoutId);
    if (!response.ok) {
      return { ok: false, latencyMs, error: `HTTP ${response.status}` };
    }
    const body = await response.json().catch(() => undefined);
    return { ok: true, latencyMs, body };
  } catch (err) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : 'Network error';
    return { ok: false, latencyMs: Date.now() - startedAt, error: message };
  }
}
