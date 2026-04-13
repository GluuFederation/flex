export type ApiError<T = { message?: string }> = {
  response?: { data?: T }
  message?: string
}
