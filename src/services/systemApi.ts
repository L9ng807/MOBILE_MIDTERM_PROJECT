import {
  API_TIMEOUT_MS,
} from '../config/api';

import {
  apiGet,
} from './apiClient';

import type {
  SystemStatusResponse,
} from '../types/api';

export function getSystemStatus(
  baseUrlOverride?: string,
): Promise<SystemStatusResponse> {
  return apiGet<SystemStatusResponse>(
    '/api/status',
    API_TIMEOUT_MS,
    baseUrlOverride,
  );
}