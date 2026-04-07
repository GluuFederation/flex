export type ApiError<T = { responseMessage?: string }> = {
  response?: { data?: T }
}
