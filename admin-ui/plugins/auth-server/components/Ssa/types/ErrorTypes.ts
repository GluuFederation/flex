export type CaughtError = Error | ApiErrorLike | string

export interface ApiErrorLike {
  message?: string
  response?: {
    status?: number
    data?: {
      message?: string
      description?: string
      error_description?: string
    }
    body?: {
      description?: string
      message?: string
      error_description?: string
    }
    text?: string
  }
}
