import React, { useCallback, useEffect, useRef, useState } from 'react'
import SessionTimeoutDialog from './GluuSessionTimeoutDialog'
import { withIdleTimer } from 'react-idle-timer'
import type { IIdleTimer } from 'react-idle-timer'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { auditLogoutLogs, setSessionTimeoutDialogOpen } from 'Redux/features/sessionSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { resetCedarlingState } from '@/redux/features/cedarPermissionsSlice'
import { cedarlingClient } from '@/cedarling'

type TimerHandle = ReturnType<typeof setTimeout>
type IntervalHandle = ReturnType<typeof setInterval>

const IDLE_DIALOG_DELAY_MS = 1000
const COUNTDOWN_SECONDS = 10

const IdleTimerPassthrough = (_props: IIdleTimer): React.ReactElement | null => null
const IdleTimer = withIdleTimer(IdleTimerPassthrough)

export interface SessionTimeoutProps {
  isAuthenticated: boolean
}

const SessionTimeout = ({ isAuthenticated }: SessionTimeoutProps) => {
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false)
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)
  const idleTimer = useRef<IIdleTimer | null>(null)
  const timers = useRef<{ timeout?: TimerHandle; countdownInterval?: IntervalHandle }>({})
  const sessionTimeout =
    useAppSelector((state) => state.authReducer?.config?.sessionTimeoutInMins) ?? 5
  const { logoutAuditSucceeded } = useAppSelector((state) => state.logoutAuditReducer)

  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()

  const clearSessionInterval = useCallback(() => {
    if (timers.current.countdownInterval != null) {
      clearInterval(timers.current.countdownInterval)
      timers.current.countdownInterval = undefined
    }
  }, [])

  const clearSessionTimeout = useCallback(() => {
    if (timers.current.timeout != null) {
      clearTimeout(timers.current.timeout)
      timers.current.timeout = undefined
    }
  }, [])

  const handleLogout = useCallback(
    (isTimedOut = false) => {
      try {
        setTimeoutModalOpen(false)
        dispatch(setSessionTimeoutDialogOpen(false))
        clearSessionInterval()
        clearSessionTimeout()
        cedarlingClient.reset()
        dispatch(resetCedarlingState())
        dispatch(
          auditLogoutLogs({
            message: isTimedOut ? 'User session timed out' : 'User logged out manually',
          }),
        )
      } catch (err) {
        console.error(err)
      }
    },
    [dispatch, clearSessionInterval, clearSessionTimeout],
  )

  const handleContinue = useCallback(() => {
    setTimeoutModalOpen(false)
    dispatch(setSessionTimeoutDialogOpen(false))
    clearSessionInterval()
    clearSessionTimeout()
    idleTimer.current?.reset()
  }, [dispatch, clearSessionInterval, clearSessionTimeout])

  const onActive = useCallback(() => {
    if (!timeoutModalOpen) {
      clearSessionInterval()
      clearSessionTimeout()
    }
  }, [timeoutModalOpen, clearSessionInterval, clearSessionTimeout])

  const onIdle = useCallback(() => {
    if (isAuthenticated && !timeoutModalOpen) {
      timers.current.timeout = setTimeout(() => {
        let countDown = COUNTDOWN_SECONDS
        dispatch(setSessionTimeoutDialogOpen(true))
        setTimeoutModalOpen(true)
        setTimeoutCountdown(countDown)
        timers.current.countdownInterval = setInterval(() => {
          if (countDown > 0) {
            setTimeoutCountdown(--countDown)
          } else {
            handleLogout(true)
          }
        }, 1000)
      }, IDLE_DIALOG_DELAY_MS)
    }
  }, [isAuthenticated, timeoutModalOpen, dispatch, handleLogout])

  useEffect(() => {
    if (logoutAuditSucceeded === true) {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [logoutAuditSucceeded, navigateToRoute])

  useEffect(() => {
    return () => {
      clearSessionInterval()
      clearSessionTimeout()
    }
  }, [clearSessionInterval, clearSessionTimeout])

  return (
    <>
      <IdleTimer
        ref={idleTimer}
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
