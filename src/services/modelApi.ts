import {
  apiGet,
} from './apiClient';

import type {
  CandidateInfo,
} from '../types/model';

export function getCandidates(): Promise<
  CandidateInfo[]
> {
  return apiGet<CandidateInfo[]>(
    '/api/candidates',
  );
}