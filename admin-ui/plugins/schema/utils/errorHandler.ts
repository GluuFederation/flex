interface ApiErrorResponse {
  data?: {
    message?: string
  }
}

export interface ApiError {
  response?: ApiErrorResponse
  message?: string
}

function isApiError(error: Error | ApiError | Record<string, never>): error is ApiError {
  return (
    !(error instanceof Error) && typeof error === 'object' && error !== null && 'response' in error
  )
}

function resolveErrorMessage(
  error: Error | ApiError | Record<string, never>,
  getFallback: () => string,
): string {
  if (isApiError(error)) {
    return error?.response?.data?.message ?? error?.message ?? getFallback()
  }
  if (error instanceof Error) {
    return error.message || getFallback()
  }
  return getFallback()
}

export function getErrorMessage(
  error: Error | ApiError | Record<string, never>,
  fallbackKey: string,
  t: (key: string) => string,
): string {
  return resolveErrorMessage(error, () => t(fallbackKey))
}

export function extractErrorMessage(
  error: Error | ApiError | Record<string, never>,
  fallback: string,
): string {
  return resolveErrorMessage(error, () => fallback)
}
