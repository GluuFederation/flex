export type AuditRecord = Record<string, string | number | boolean | object | null | undefined>

export interface SagaErrorShape {
  response?: { body?: { responseMessage?: string }; status?: number }
  message?: string
}

export interface HttpErrorLike {
  response?: { status?: number }
  status?: number
}

export const isSagaError = (error: Error | SagaErrorShape): error is SagaErrorShape =>
  typeof error === 'object' && error !== null && ('response' in error || 'message' in error)

export const isHttpLikeError = (
  error: Error | SagaErrorShape,
): error is SagaErrorShape & HttpErrorLike => {
  if (typeof error !== 'object' || error === null) return false
  const e = error as Record<string, number | object | undefined>
  if (typeof e.status === 'number') return true
  if (typeof e.response === 'object' && e.response !== null) {
    const res = e.response as Record<string, number | undefined>
    if (typeof res.status === 'number') return true
  }
  return false
}

export const getErrorMessage = (error: Error | SagaErrorShape): string =>
  isSagaError(error)
    ? error?.response?.body?.responseMessage || error?.message || 'Unknown error'
    : error instanceof Error
      ? error.message
      : 'Unknown error'
