import React, { useRef, useState } from 'react'
import IdleTimer from 'react-idle-timer'
import SessionTimeoutDialog from './GluuSessionTimeoutDialog'
import { useHistory } from 'react-router-dom'
let countdownInterval
let timeout

const SessionTimeout = ({ isAuthenticated }) => {
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false)
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)
  const idleTimer = useRef(null)
  const SESSION_TIMEOUT_IN_MINUTES = process.env.SESSION_TIMEOUT_IN_MINUTES
  const history = useHistory()

  const clearSessionTimeout = () => {
    clearTimeout(timeout)
  }

  const clearSessionInterval = () => {
    clearInterval(countdownInterval)
  }

  const handleLogout = async (isTimedOut = false) => {
    try {
      setTimeoutModalOpen(false)
      clearSessionInterval()
      clearSessionTimeout()
      history.push('/logout')
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
        timeout={SESSION_TIMEOUT_IN_MINUTES * 60 * 1000}
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
