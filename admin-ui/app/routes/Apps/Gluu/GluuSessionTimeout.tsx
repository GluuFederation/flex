import React, { useEffect, useRef, useState } from 'react'
import SessionTimeoutDialog from './GluuSessionTimeoutDialog'
import { withIdleTimer, type IIdleTimer } from 'react-idle-timer'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { devLogger } from '@/utils/devLogger'

type SessionTimeoutProps = {
  isAuthenticated: boolean
}

let countdownInterval: ReturnType<typeof setInterval> | null = null
let timeout: ReturnType<typeof setTimeout> | null = null

const IdleTimerComponent = ({ children }: IIdleTimer & { children?: React.ReactNode }) =>
  children as React.ReactElement
const IdleTimer = withIdleTimer(IdleTimerComponent)

const SessionTimeout = ({ isAuthenticated }: SessionTimeoutProps) => {
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false)
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)
  const idleTimer = useRef(null)
  const sessionTimeout =
    Number(useAppSelector((state) => state.authReducer?.config?.sessionTimeoutInMins)) || 5
  const { logoutAuditSucceeded } = useAppSelector((state) => state.logoutAuditReducer)

  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()

  const clearSessionTimeout = () => {
    if (timeout) clearTimeout(timeout)
  }

  const clearSessionInterval = () => {
    if (countdownInterval) clearInterval(countdownInterval)
  }

  const handleLogout = (isTimedOut = false) => {
    try {
      setTimeoutModalOpen(false)
      clearSessionInterval()
      clearSessionTimeout()
      dispatch(
        auditLogoutLogs({
          message: isTimedOut ? 'User session timed out' : 'User logged out mannually',
        }),
      )
    } catch (err) {
      devLogger.error(err)
    }
  }

  const handleContinue = () => {
    setTimeoutModalOpen(false)
    clearSessionInterval()
    clearSessionTimeout()
  }

  const onActive = () => {
    if (!timeoutModalOpen) {
      clearSessionInterval()
      clearSessionTimeout()
    }
  }

  const onIdle = () => {
    const delay = 1000 * 1
    if (isAuthenticated && !timeoutModalOpen) {
      timeout = setTimeout(() => {
        let countDown = 10
        setTimeoutModalOpen(true)
        setTimeoutCountdown(countDown)
        countdownInterval = setInterval(() => {
          if (countDown > 0) {
            setTimeoutCountdown(--countDown)
          } else {
            handleLogout(true)
          }
        }, 1000)
      }, delay)
    }
  }

  useEffect(() => {
    if (logoutAuditSucceeded === true) {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [logoutAuditSucceeded, navigateToRoute])

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
