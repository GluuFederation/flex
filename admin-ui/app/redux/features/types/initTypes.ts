export type InitState = {
  isTimeout: boolean
  isSessionExpired: boolean
}

export type ApiTimeoutPayload = {
  isTimeout: boolean
}

export type SessionExpiredPayload = {
  isSessionExpired: boolean
}
