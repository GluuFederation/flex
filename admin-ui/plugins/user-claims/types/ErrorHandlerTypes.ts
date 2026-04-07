export interface ApiErrorResponse {
  data?: {
    message?: string
  }
}

export interface ApiError {
  response?: ApiErrorResponse
  message?: string
}

export type CaughtError = Error | ApiError | null | undefined
