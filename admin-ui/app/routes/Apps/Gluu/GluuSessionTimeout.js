import React, { useRef, useState } from 'react'
import SessionTimeoutDialog from './GluuSessionTimeoutDialog'
import { useNavigate } from 'react-router-dom'
import { withIdleTimer } from 'react-idle-timer'
import { useSelector } from 'react-redux'

let countdownInterval
let timeout

const IdleTimerComponent = ({ children }) => children
const IdleTimer = withIdleTimer(IdleTimerComponent)

const SessionTimeout = ({ isAuthenticated }) => {
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false)
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)
  const idleTimer = useRef(null)
  const sessionTimeout = useSelector((state) => state.authReducer?.config?.sessionTimeoutInMins) || 5
  const navigate =useNavigate()

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
      navigate('/logout')
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
