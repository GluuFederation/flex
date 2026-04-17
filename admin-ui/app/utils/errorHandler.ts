import type { ApiError, CaughtError } from './types'

export type { ApiError, CaughtError }

const isApiError = (error: CaughtError): error is ApiError => {
  return typeof error === 'object' && error !== null && 'response' in error
}

const resolveErrorMessage = (error: CaughtError, getFallback: () => string): string => {
  if (isApiError(error)) {
    return (
      error?.response?.data?.responseMessage ??
      error?.response?.data?.message ??
      error?.message ??
      getFallback()
    )
  }
  if (error instanceof Error) {
    return error.message || getFallback()
  }
  return getFallback()
}

export const getErrorMessage = (
  error: CaughtError,
  fallbackKey: string,
  t: (key: string) => string,
): string => {
  return resolveErrorMessage(error, () => t(fallbackKey))
}

export const extractErrorMessage = (error: CaughtError, fallback: string): string => {
  return resolveErrorMessage(error, () => fallback)
}

export const getQueryErrorMessage = (error: unknown, fallback: string): string => {
  if (error !== null && error !== undefined && typeof error === 'object') {
    if ('response' in error) {
      const typedError = error as ApiError
      return typedError.response?.data?.message || fallback
    }
    if (error instanceof Error) {
      return error.message || fallback
    }
  }
  return fallback
}
