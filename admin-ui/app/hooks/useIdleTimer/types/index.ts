export type UseIdleTimerOptions = {
  timeout: number
  onIdle?: () => void
  onActive?: () => void
  debounce?: number
  events?: string[]
  disabled?: boolean
}

export type UseIdleTimerResult = {
  reset: () => void
  isIdle: boolean
}
