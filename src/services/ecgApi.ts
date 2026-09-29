import { apiGet } from './apiClient';

import type {
  DatasetSplit,
  ECGRecordResponse,
  ECGRecordsResponse,
} from '../types/ecg';

export function getDatasetRecords(
  split: DatasetSplit,
): Promise<ECGRecordsResponse> {
  return apiGet<ECGRecordsResponse>(
    `/api/dataset/records?split=${encodeURIComponent(
      split,
    )}`,
  );
}

export function getDatasetRecord(
  split: DatasetSplit,
  recordId: string,
): Promise<ECGRecordResponse> {
  return apiGet<ECGRecordResponse>(
    `/api/dataset/record/${encodeURIComponent(
      split,
    )}/${encodeURIComponent(recordId)}`,
  );
}