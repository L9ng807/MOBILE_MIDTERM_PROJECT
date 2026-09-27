import {
  API_TIMEOUT_MS,
} from '../config/api';

import {
  useConnectionStore,
} from '../store/useConnectionStore';

export class ApiError extends Error {
  status?: number;

  constructor(
    message: string,
    status?: number,
  ) {
    super(message);

    this.name =
      'ApiError';

    this.status =
      status;
  }
}

export function normalizeBaseUrl(
  value: string,
): string {
  return value
    .trim()
    .replace(/\/+$/, '');
}

export function isValidBackendUrl(
  value: string,
): boolean {
  const normalized =
    normalizeBaseUrl(
      value,
    );

  return /^https?:\/\/[^\s]+$/i.test(
    normalized,
  );
}

function getCurrentBaseUrl(): string {
  return normalizeBaseUrl(
    useConnectionStore
      .getState()
      .backendUrl,
  );
}

function normalizePath(
  path: string,
): string {
  return path.startsWith('/')
    ? path
    : `/${path}`;
}

async function request<T>(
  path: string,
  options?: RequestInit,
  timeoutMs:
    number = API_TIMEOUT_MS,
  baseUrlOverride?: string,
): Promise<T> {
  const controller =
    new AbortController();

  const timeoutId =
    setTimeout(
      () => {
        controller.abort();
      },
      timeoutMs,
    );

  const baseUrl =
    baseUrlOverride
      ? normalizeBaseUrl(
          baseUrlOverride,
        )
      : getCurrentBaseUrl();

  const requestUrl =
    `${baseUrl}${normalizePath(
      path,
    )}`;

  try {
    const response =
      await fetch(
        requestUrl,
        {
          ...options,

          signal:
            controller.signal,
        },
      );

    if (!response.ok) {
      let message =
        `API request failed with status ${response.status}`;

      try {
        const responseText =
          await response.text();

        if (
          responseText
        ) {
          message =
            responseText;
        }
      } catch {
        // Keep default message.
      }

      throw new ApiError(
        message,
        response.status,
      );
    }

    return (
      await response.json()
    ) as T;
  } catch (error) {
    if (
      error instanceof
        Error &&
      error.name ===
        'AbortError'
    ) {
      throw new ApiError(
        `Request timed out after ${timeoutMs} ms`,
      );
    }

    if (
      error instanceof
      ApiError
    ) {
      throw error;
    }

    if (
      error instanceof
      Error
    ) {
      throw new ApiError(
        error.message,
      );
    }

    throw new ApiError(
      'Unknown API error',
    );
  } finally {
    clearTimeout(
      timeoutId,
    );
  }
}

export function apiGet<T>(
  path: string,
  timeoutMs:
    number = API_TIMEOUT_MS,
  baseUrlOverride?: string,
): Promise<T> {
  return request<T>(
    path,
    {
      method: 'GET',
    },
    timeoutMs,
    baseUrlOverride,
  );
}

export function apiPost<
  TResponse,
  TBody,
>(
  path: string,
  body: TBody,
  timeoutMs:
    number = API_TIMEOUT_MS,
  baseUrlOverride?: string,
): Promise<TResponse> {
  return request<TResponse>(
    path,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body:
        JSON.stringify(
          body,
        ),
    },
    timeoutMs,
    baseUrlOverride,
  );
}