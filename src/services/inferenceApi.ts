import {
  apiPost,
} from './apiClient';

import {
  ECG_CLASSES,
} from '../types/ecg';

import type {
  ECGClass,
} from '../types/ecg';

import type {
  InferenceBeatPayload,
  InferenceDisplayResult,
  SoftwareComparisonRequest,
  SoftwareComparisonResponse,
  SoftwareInferenceRequest,
  SoftwareInferenceResponse,
} from '../types/inference';

export async function runSoftwareInference(
  candidateId: number,
  beat: InferenceBeatPayload,
): Promise<InferenceDisplayResult> {
  const requestBody:
    SoftwareInferenceRequest =
    {
      candidate_id:
        candidateId,

      beat,
    };

  const response =
    await apiPost<
      SoftwareInferenceResponse,
      SoftwareInferenceRequest
    >(
      '/api/predict/software',
      requestBody,
    );

  if (
    !response.ok ||
    !response.result
  ) {
    throw new Error(
      response.error ??
        'Software inference failed.',
    );
  }

  const backendResult =
    response.result;

  const probabilitiesPercent =
    {} as Record<
      ECGClass,
      number
    >;

  ECG_CLASSES.forEach(
    (ecgClass) => {
      probabilitiesPercent[
        ecgClass
      ] =
        (
          backendResult
            .probabilities[
            ecgClass
          ] ?? 0
        ) * 100;
    },
  );

  return {
    backend:
      backendResult.backend,

    predictedClass:
      backendResult
        .predicted_class,

    confidencePercent:
      backendResult
        .confidence *
      100,

    probabilitiesPercent,

    latencyMs:
      backendResult
        .latency_ms,

    modelPath:
      backendResult
        .model_path,

    candidate:
      backendResult
        .candidate,
  };
}

export async function compareSoftwareModels(
  beat: InferenceBeatPayload,
): Promise<SoftwareComparisonResponse> {
  const body:
    SoftwareComparisonRequest =
    {
      beat,
    };

  const response =
    await apiPost<
      SoftwareComparisonResponse,
      SoftwareComparisonRequest
    >(
      '/api/compare/software',
      body,

      // Comparing all four
      // models can take longer
      // than one inference.
      30000,
    );

  if (!response.ok) {
    throw new Error(
      'Software model comparison failed.',
    );
  }

  return response;
}