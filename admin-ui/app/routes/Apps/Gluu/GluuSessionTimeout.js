import React, { useEffect, useRef, useState } from 'react'
import SessionTimeoutDialog from './GluuSessionTimeoutDialog'
import { useNavigate } from 'react-router-dom'
import { withIdleTimer } from 'react-idle-timer'
import { useDispatch, useSelector } from 'react-redux'
import { auditLogoutLogs } from '../../../../plugins/user-management/redux/features/userSlice'
import { use } from 'i18next'

let countdownInterval
let timeout

const IdleTimerComponent = ({ children }) => children
const IdleTimer = withIdleTimer(IdleTimerComponent)

const SessionTimeout = ({ isAuthenticated }) => {
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false)
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)
  const idleTimer = useRef(null)
  const sessionTimeout = useSelector((state) => state.authReducer?.config?.sessionTimeoutInMins) || 5
  const { isUserLogout } = useSelector((state) => state.userReducer);

  const navigate =useNavigate();
  const dispatch = useDispatch()

  const clearSessionTimeout = () => {
    clearTimeout(timeout)
  }

  const clearSessionInterval = () => {
    clearInterval(countdownInterval)
  }

  const handleLogout = (isTimedOut = false) => {
    try {
      setTimeoutModalOpen(false)
      clearSessionInterval()
      clearSessionTimeout()
      dispatch(auditLogoutLogs({ message: isTimedOut ? 'User session timed out' : 'User logged out mannually' }))
    } catch (err) {
      console.error(err)
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
    if (isUserLogout) {
      navigate("/logout");
    }
  }, [isUserLogout]);

  return (
    <>
      <IdleTimer
        ref={idleTimer}
        onActive={onActive}
        onIdle={onIdle}
        debounce={250}
        timeout={sessionTimeout * 1 * 1000}
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
