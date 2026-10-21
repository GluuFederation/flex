import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { storage } from '@/utils/storage'
import type { UseIdleTimerOptions, UseIdleTimerResult } from './types'

const DEFAULT_EVENTS = ['mousemove', 'mousedown', 'keydown', 'wheel', 'touchstart', 'touchmove']
const SYNC_WRITE_INTERVAL_MS = 10_000

const eventTarget = (eventName: string): Window | Document =>
  eventName === 'visibilitychange' ? document : window

const readSharedActivity = (syncKey?: string): number =>
  syncKey ? Number(storage.get(syncKey)) || 0 : 0

const useIdleTimer = ({
  timeout,
  onIdle,
  onActive,
  onRemoteActivity,
  debounce = 0,
  events = DEFAULT_EVENTS,
  disabled = false,
  syncKey,
}: UseIdleTimerOptions): UseIdleTimerResult => {
  const [isIdle, setIsIdle] = useState(false)
  const onIdleRef = useRef(onIdle)
  const onActiveRef = useRef(onActive)
  const onRemoteActivityRef = useRef(onRemoteActivity)
  const timeoutRef = useRef(timeout)
  const debounceRef = useRef(debounce)
  const syncKeyRef = useRef(syncKey)
  const isIdleRef = useRef(false)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastActivityRef = useRef(Number.NEGATIVE_INFINITY)
  const lastSyncWriteRef = useRef(Number.NEGATIVE_INFINITY)

  useLayoutEffect(() => {
    onIdleRef.current = onIdle
    onActiveRef.current = onActive
    onRemoteActivityRef.current = onRemoteActivity
    timeoutRef.current = timeout
    debounceRef.current = debounce
    syncKeyRef.current = syncKey
  })

  const clearTimer = useCallback(() => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    const schedule = (delay: number) => {
      timeoutIdRef.current = setTimeout(() => {
        const sinceSharedActivity = Date.now() - readSharedActivity(syncKeyRef.current)
        const remaining = timeoutRef.current - sinceSharedActivity
        if (remaining > 0) {
          schedule(remaining)
          return
        }
        isIdleRef.current = true
        setIsIdle(true)
        onIdleRef.current?.()
      }, delay)
    }
    schedule(timeoutRef.current)
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
    const shareActivity = (now: number) => {
      const key = syncKeyRef.current
      if (!key || now - lastSyncWriteRef.current < SYNC_WRITE_INTERVAL_MS) return
      lastSyncWriteRef.current = now
      storage.set(key, String(now))
    }
    const handleActivity = () => {
      const now = Date.now()
      if (debounceRef.current > 0 && now - lastActivityRef.current < debounceRef.current) {
        return
      }
      lastActivityRef.current = now
      shareActivity(now)
      reset()
    }
    const handleRemoteActivity = (event: StorageEvent) => {
      if (!syncKeyRef.current || event.key !== syncKeyRef.current || !event.newValue) return
      reset()
      onRemoteActivityRef.current?.()
    }
    events.forEach((eventName) =>
      eventTarget(eventName).addEventListener(eventName, handleActivity, { passive: true }),
    )
    window.addEventListener('storage', handleRemoteActivity)
    return () => {
      clearTimer()
      events.forEach((eventName) =>
        eventTarget(eventName).removeEventListener(eventName, handleActivity),
      )
      window.removeEventListener('storage', handleRemoteActivity)
    }
  }, [disabled, events, reset, startTimer, clearTimer])

  return { reset, isIdle }
}
export default useIdleTimer
