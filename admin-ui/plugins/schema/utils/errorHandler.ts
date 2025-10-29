interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && ('response' in error || 'message' in error)
}

export function getErrorMessage(
  error: unknown,
  fallbackKey: string,
  t: (key: string) => string,
): string {
  if (isApiError(error)) {
    return error?.response?.data?.message ?? error?.message ?? t(fallbackKey)
  }
  return t(fallbackKey)
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    return error?.response?.data?.message ?? error?.message ?? fallback
  }
  return fallback
}
