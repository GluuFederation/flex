import React, { useCallback, useEffect, useRef, useState } from 'react'
import SessionTimeoutDialog from './GluuSessionTimeoutDialog'
import { withIdleTimer } from 'react-idle-timer'
import type { IIdleTimer } from 'react-idle-timer'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

type TimerHandle = ReturnType<typeof setTimeout>

const DEFAULT_IDLE_DIALOG_DELAY_MS = 1000
const DEFAULT_COUNTDOWN_SECONDS = 10
const COUNTDOWN_TICK_MS = 1000

const IdleTimerPassthrough = (_props: IIdleTimer): React.ReactElement | null => null
const IdleTimer = withIdleTimer(IdleTimerPassthrough)

interface SessionTimeoutProps {
  isAuthenticated: boolean
}

const SessionTimeout = ({ isAuthenticated }: SessionTimeoutProps) => {
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false)
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)
  const idleTimer = useRef<IIdleTimer | null>(null)
  const dialogDelayTimeout = useRef<TimerHandle | undefined>(undefined)
  const config = useAppSelector((state) => state.authReducer?.config)
  const sessionTimeoutMins = config?.sessionTimeoutInMins ?? 5
  const idleDialogDelayMs = config?.sessionTimeoutDialogDelayMs ?? DEFAULT_IDLE_DIALOG_DELAY_MS
  const countdownSeconds = config?.sessionTimeoutCountdownSeconds ?? DEFAULT_COUNTDOWN_SECONDS
  const logoutAuditSucceeded = useAppSelector(
    (state) => state.logoutAuditReducer.logoutAuditSucceeded,
  )

  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()

  const clearDialogDelayTimeout = useCallback(() => {
    if (dialogDelayTimeout.current != null) {
      clearTimeout(dialogDelayTimeout.current)
      dialogDelayTimeout.current = undefined
    }
  }, [])

  const handleLogout = useCallback(
    (isTimedOut = false) => {
      try {
        setTimeoutModalOpen(false)
        clearDialogDelayTimeout()
        dispatch(
          auditLogoutLogs({
            message: isTimedOut ? 'User session timed out' : 'User logged out manually',
          }),
        )
      } catch (err) {
        console.error(err)
      }
    },
    [dispatch, clearDialogDelayTimeout],
  )

  const handleContinue = useCallback(() => {
    setTimeoutModalOpen(false)
    clearDialogDelayTimeout()
    idleTimer.current?.reset()
  }, [clearDialogDelayTimeout])

  const onActive = useCallback(() => {
    if (!timeoutModalOpen) {
      clearDialogDelayTimeout()
    }
  }, [timeoutModalOpen, clearDialogDelayTimeout])

  const onIdle = useCallback(() => {
    if (isAuthenticated && !timeoutModalOpen) {
      dialogDelayTimeout.current = setTimeout(() => {
        setTimeoutModalOpen(true)
        setTimeoutCountdown(countdownSeconds)
      }, idleDialogDelayMs)
    }
  }, [isAuthenticated, timeoutModalOpen, countdownSeconds, idleDialogDelayMs])

  useEffect(() => {
    if (!timeoutModalOpen || timeoutCountdown <= 0) return
    const id = setTimeout(() => {
      if (timeoutCountdown <= 1) {
        handleLogout(true)
      } else {
        setTimeoutCountdown(timeoutCountdown - 1)
      }
    }, COUNTDOWN_TICK_MS)
    return () => clearTimeout(id)
  }, [timeoutModalOpen, timeoutCountdown, handleLogout])

  useEffect(() => {
    if (logoutAuditSucceeded === true) {
      navigateToRoute(ROUTES.LOGOUT)
    }
    return () => clearDialogDelayTimeout()
  }, [logoutAuditSucceeded, navigateToRoute, clearDialogDelayTimeout])

  const idleTimeoutMs = sessionTimeoutMins * 60 * 1000

  return (
    <>
      <IdleTimer
        ref={idleTimer}
        onActive={onActive}
        onIdle={onIdle}
        debounce={250}
        timeout={idleTimeoutMs}
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
