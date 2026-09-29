export interface DatasetStatus {
  connected: boolean;
  csv_dir: string;
  mode: string;
  record_dir: string;
}

export interface NASBackendStatus {
  config_dir: string;
  search_space_backend_ready: boolean;
}

export interface RuntimeStatus {
  model_paths: Record<string, string>;
  models_found: number;
  models_total: number;
  tensorflow_available: boolean;
}

export interface SystemStatusResponse {
  dataset: DatasetStatus;
  nas: NASBackendStatus;
  pynq_configured: boolean;
  runtime: RuntimeStatus;
}