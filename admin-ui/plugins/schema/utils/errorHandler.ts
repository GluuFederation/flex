/**
 * Error handling utilities for Schema plugin
 */

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

/**
 * Type guard to check if error is an API error
 */
function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && ('response' in error || 'message' in error)
}

/**
 * Extracts error message from various error formats with i18n fallback
 * @param error The error object from API call
 * @param fallbackKey Translation key for fallback message
 * @param t Translation function
 * @returns Error message string
 */
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

/**
 * Extracts error message from API error (without i18n)
 * @param error The error object from API call
 * @param fallback Fallback message
 * @returns Error message string
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    return error?.response?.data?.message ?? error?.message ?? fallback
  }
  return fallback
}
