export type UseIdleTimerOptions = {
  timeout: number
  onIdle?: () => void
  onActive?: () => void
  onRemoteActivity?: () => void
  debounce?: number
  events?: string[]
  disabled?: boolean
  syncKey?: string
}

export type UseIdleTimerResult = {
  reset: () => void
  isIdle: boolean
}
