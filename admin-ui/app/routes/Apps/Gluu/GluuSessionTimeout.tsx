import React, { useCallback, useEffect, useRef, useState } from 'react'
import SessionTimeoutDialog from './GluuSessionTimeoutDialog'
import { withIdleTimer, type IIdleTimer } from 'react-idle-timer'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { devLogger } from '@/utils/devLogger'

type SessionTimeoutProps = {
  isAuthenticated: boolean
}

const COUNTDOWN_SECONDS = 10
const DEFAULT_TIMEOUT_MINS = 5
const IDLE_TO_MODAL_DELAY = 1000

const IdleTimerComponent = ({ children }: IIdleTimer & { children?: React.ReactNode }) =>
  (children as React.ReactElement) ?? null
const IdleTimer = withIdleTimer(IdleTimerComponent)

const SessionTimeout = ({ isAuthenticated }: SessionTimeoutProps) => {
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false)
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sessionTimeout =
    Number(useAppSelector((state) => state.authReducer?.config?.sessionTimeoutInMins)) ||
    DEFAULT_TIMEOUT_MINS
  const { logoutAuditSucceeded } = useAppSelector((state) => state.logoutAuditReducer)

  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }, [])

  const handleLogout = useCallback(
    (isTimedOut = false) => {
      try {
        setTimeoutModalOpen(false)
        clearTimers()
        dispatch(
          auditLogoutLogs({
            message: isTimedOut ? 'User session timed out' : 'User logged out manually',
          }),
        )
      } catch (err) {
        devLogger.error(err)
      }
    },
    [clearTimers, dispatch],
  )

  const handleContinue = useCallback(() => {
    setTimeoutModalOpen(false)
    clearTimers()
  }, [clearTimers])

  const onActive = useCallback(() => {
    if (!timeoutModalOpen) {
      clearTimers()
    }
  }, [timeoutModalOpen, clearTimers])

  const onIdle = useCallback(() => {
    if (isAuthenticated && !timeoutModalOpen) {
      timeoutRef.current = setTimeout(() => {
        let countDown = COUNTDOWN_SECONDS
        setTimeoutModalOpen(true)
        setTimeoutCountdown(countDown)
        countdownIntervalRef.current = setInterval(() => {
          if (countDown > 0) {
            setTimeoutCountdown(--countDown)
          } else {
            handleLogout(true)
          }
        }, 1000)
      }, IDLE_TO_MODAL_DELAY)
    }
  }, [isAuthenticated, timeoutModalOpen, handleLogout])

  const wasAuthenticated = useRef(isAuthenticated)
  useEffect(() => {
    if (wasAuthenticated.current && !isAuthenticated) {
      clearTimers()
      setTimeoutModalOpen(false)
      setTimeoutCountdown(0)
    }
    wasAuthenticated.current = isAuthenticated
  }, [isAuthenticated, clearTimers])

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  useEffect(() => {
    if (logoutAuditSucceeded === true) {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [logoutAuditSucceeded, navigateToRoute])

  return (
    <>
      <IdleTimer
        key={sessionTimeout}
        onActive={onActive}
        onIdle={onIdle}
        debounce={250}
        timeout={sessionTimeout * 60 * 1000}
      />
      <SessionTimeoutDialog
        countdown={timeoutCountdown}
        onContinue={handleContinue}
        onLogout={() => handleLogout(false)}
        open={timeoutModalOpen}
      />
    </>
  )
}

export default SessionTimeout
