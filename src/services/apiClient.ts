import {
  API_BASE_URL,
  API_TIMEOUT_MS,
} from '../config/api';

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

async function request<T>(
  path: string,
  options?: RequestInit,
  timeoutMs:
    number = API_TIMEOUT_MS,
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

  try {
    const response =
      await fetch(
        `${API_BASE_URL}${path}`,
        {
          ...options,

          signal:
            controller.signal,
        },
      );

    if (
      !response.ok
    ) {
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
): Promise<T> {
  return request<T>(
    path,
    {
      method: 'GET',
    },
    timeoutMs,
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
  );
}