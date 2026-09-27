import { apiGet } from './apiClient';

import type {
  SystemStatusResponse,
} from '../types/api';

export function getSystemStatus(): Promise<SystemStatusResponse> {
  return apiGet<SystemStatusResponse>(
    '/api/status',
  );
}