interface ApiErrorResponse {
  data?: {
    message?: string
  }
}

interface ApiError {
  response?: ApiErrorResponse
  message?: string
}

function isApiError(error: Error | ApiError | Record<string, never>): error is ApiError {
  return typeof error === 'object' && error !== null && ('response' in error || 'message' in error)
}

export function getErrorMessage(
  error: Error | ApiError | Record<string, never>,
  fallbackKey: string,
  t: (key: string) => string,
): string {
  if (isApiError(error)) {
    return error?.response?.data?.message ?? error?.message ?? t(fallbackKey)
  }
  if (error instanceof Error) {
    return error.message || t(fallbackKey)
  }
  return t(fallbackKey)
}

export function extractErrorMessage(
  error: Error | ApiError | Record<string, never>,
  fallback: string,
): string {
  if (isApiError(error)) {
    return error?.response?.data?.message ?? error?.message ?? fallback
  }
  if (error instanceof Error) {
    return error.message || fallback
  }
  return fallback
}
