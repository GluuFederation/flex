export type ApiError<T = { message?: string; responseMessage?: string }> = {
  response?: { data?: T }
  message?: string
}
