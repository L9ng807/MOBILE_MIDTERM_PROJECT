export interface CandidateInfo {
  candidate_id: number;

  role: string;

  label: string;

  purpose: string;

  val_accuracy: number;

  val_macro_f1: number;

  params: number;

  macs: number;

  memory_mb: number;

  int8_status: string;

  int8_val_accuracy: number;

  int8_val_macro_f1: number;

  int8_model_size_kb: number;
}