// Type guard function to check if error has response property
export function isSagaError(
  error: unknown,
): error is { response?: { body?: { responseMessage?: string } }; message?: string } {
  return typeof error === 'object' && error !== null && ('response' in error || 'message' in error)
}

// Helper function to safely extract error message
export function getErrorMessage(error: unknown): string {
  if (isSagaError(error)) {
    return error?.response?.body?.responseMessage || error?.message || 'Unknown error'
  }
  return 'Unknown error'
}
