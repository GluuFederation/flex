import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import logo192 from 'Images/logos/logo192.png'
import { buildAppRootUrl } from '@/helpers/navigation'
import type { GluuErrorModalProps } from './types'
import { useStyles } from './styles/GluuErrorModal.style'

const GluuErrorModal = ({
  message = '',
  description = '',
  onRetry,
  retryLabel = 'Try Again',
}: GluuErrorModalProps) => {
  const { classes } = useStyles()
  const titleId = useId()
  const descriptionId = useId()
  const retryRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    retryRef.current?.focus()

    const keepFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      e.preventDefault()
      retryRef.current?.focus()
    }

    document.addEventListener('keydown', keepFocus)
    return () => document.removeEventListener('keydown', keepFocus)
  }, [])

  const handleRefresh = () => {
    if (onRetry) {
      onRetry()
      return
    }

    window.location.href = buildAppRootUrl()
  }

  return createPortal(
    <div
      className={classes.overlay}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={message ? titleId : undefined}
      aria-label={message ? undefined : retryLabel}
      aria-describedby={description ? descriptionId : undefined}
    >
      <img src={logo192} alt="Gluu" className={classes.logo} />
      {message && (
        <h2 id={titleId} className={classes.message}>
          {message}
        </h2>
      )}
      {description && (
        <p id={descriptionId} className={classes.description}>
          {description}
        </p>
      )}
      <button ref={retryRef} type="button" className={classes.retryButton} onClick={handleRefresh}>
        {retryLabel}
      </button>
    </div>,
    document.body,
  )
}

export default GluuErrorModal
