export function isSagaError(
  error: unknown,
): error is { response?: { body?: { responseMessage?: string } }; message?: string } {
  return typeof error === 'object' && error !== null && ('response' in error || 'message' in error)
}

export function isHttpLikeError(
  error: unknown,
): error is { response?: { status?: number }; status?: number } {
  return typeof error === 'object' && error !== null
}

export function getErrorMessage(error: unknown): string {
  if (isSagaError(error)) {
    return error?.response?.body?.responseMessage || error?.message || 'Unknown error'
  }
  return 'Unknown error'
}
