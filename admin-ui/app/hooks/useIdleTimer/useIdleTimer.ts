import { useCallback, useEffect, useRef, useState } from 'react'
import type { UseIdleTimerOptions, UseIdleTimerResult } from './types'

const DEFAULT_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'wheel',
  'touchstart',
  'touchmove',
  'visibilitychange',
]

const eventTarget = (eventName: string): Window | Document =>
  eventName === 'visibilitychange' ? document : window

export const useIdleTimer = ({
  timeout,
  onIdle,
  onActive,
  debounce = 0,
  events = DEFAULT_EVENTS,
  disabled = false,
}: UseIdleTimerOptions): UseIdleTimerResult => {
  const [isIdle, setIsIdle] = useState(false)
  const onIdleRef = useRef(onIdle)
  const onActiveRef = useRef(onActive)
  const timeoutRef = useRef(timeout)
  const debounceRef = useRef(debounce)
  const isIdleRef = useRef(false)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastActivityRef = useRef(Number.NEGATIVE_INFINITY)

  onIdleRef.current = onIdle
  onActiveRef.current = onActive
  timeoutRef.current = timeout
  debounceRef.current = debounce

  const clearTimer = useCallback(() => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    timeoutIdRef.current = setTimeout(() => {
      isIdleRef.current = true
      setIsIdle(true)
      onIdleRef.current?.()
    }, timeoutRef.current)
  }, [clearTimer])

  const reset = useCallback(() => {
    if (isIdleRef.current) {
      isIdleRef.current = false
      setIsIdle(false)
      onActiveRef.current?.()
    }
    startTimer()
  }, [startTimer])

  useEffect(() => {
    if (disabled) {
      clearTimer()
      return undefined
    }
    startTimer()
    const handleActivity = () => {
      const now = Date.now()
      if (debounceRef.current > 0 && now - lastActivityRef.current < debounceRef.current) {
        return
      }
      lastActivityRef.current = now
      reset()
    }
    events.forEach((eventName) =>
      eventTarget(eventName).addEventListener(eventName, handleActivity, { passive: true }),
    )
    return () => {
      clearTimer()
      events.forEach((eventName) =>
        eventTarget(eventName).removeEventListener(eventName, handleActivity),
      )
    }
  }, [disabled, events, reset, startTimer, clearTimer])

  return { reset, isIdle }
}

export default useIdleTimer
