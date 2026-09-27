import type {
  NavigatorScreenParams,
} from '@react-navigation/native';

import type {
  DatasetSplit,
  ECGInferenceInput,
} from './ecg';

export type ECGViewerDatasetParams = {
  inputSource: 'dataset';

  recordId: string;

  split: DatasetSplit;
};

export type ECGViewerUploadParams = {
  inputSource: 'upload';

  recordId: string;

  uploadedFileName: string;

  uploadedSamples: number[];

  samplingRate: number;
};

export type ECGViewerParams =
  | ECGViewerDatasetParams
  | ECGViewerUploadParams;

export type ECGStackParamList = {
  ECGInput: undefined;

  ECGViewer: ECGViewerParams;
};

export type RootTabParamList = {
  Dashboard: undefined;

  ECG:
    | NavigatorScreenParams<ECGStackParamList>
    | undefined;

  /*
   * Inference can also be opened directly
   * from the bottom tab before a heartbeat
   * has been selected.
   */
  Inference:
    | ECGInferenceInput
    | undefined;

  Performance: undefined;

  Settings: undefined;
};