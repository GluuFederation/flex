import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { buildSafeNavigationUrl } from '@/utils/urlSecurity'
import { Close, CheckCircle, ErrorIcon, Warning, Info } from '@/components/icons'
import type { ToastMessage, ToastType } from '@/redux/types'
import type { ToastItem } from './types/GluuToast.types'
import { useStyles, TOAST_TYPE_COLOR } from './styles/GluuToast.style'

const DEFAULT_AUTO_CLOSE = 10000
const EXIT_ANIMATION_MS = 300

const ICON_BY_TYPE: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: ErrorIcon,
  warning: Warning,
  info: Info,
}

const TITLE_KEY_BY_TYPE: Record<ToastType, string> = {
  success: 'messages.success',
  error: 'messages.error',
  warning: 'messages.warning',
  info: 'messages.info',
}

const renderToastBody = (
  t: TFunction,
  type: ToastType,
  message: ToastMessage,
  titleClassName: string,
) => {
  const normalizedMessage =
    typeof message === 'string' ? message : ((message as { message?: string }).message ?? '')
  return (
    <>
      <span className={titleClassName}>{t(TITLE_KEY_BY_TYPE[type])}</span>
      <br />
      {normalizedMessage === ''
        ? type === 'success'
          ? t('messages.success_in_saving')
          : t('messages.error_processing_request')
        : normalizedMessage}
    </>
  )
}

type ToastTimer = {
  timer: ReturnType<typeof setTimeout>
  start: number
  remaining: number
  item: ToastItem
  paused: boolean
}

const GluuToast = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { classes } = useStyles()

  const { showToast, message, type, onCloseRedirectUrl } = useAppSelector(
    (reduxState) => reduxState.toastReducer,
  )

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [paused, setPaused] = useState(false)
  const timersRef = useRef<Map<string, ToastTimer>>(new Map())
  const exitingRef = useRef<Set<string>>(new Set())
  const counterRef = useRef(0)

  const removeToast = useCallback((id: string) => {
    exitingRef.current.delete(id)
    const entry = timersRef.current.get(id)
    if (entry) {
      clearTimeout(entry.timer)
      timersRef.current.delete(id)
    }
    setToasts((prev) =>
      prev.some((toast) => toast.id === id) ? prev.filter((toast) => toast.id !== id) : prev,
    )
  }, [])

  const beginExit = useCallback(
    (item: ToastItem) => {
      if (exitingRef.current.has(item.id)) return
      exitingRef.current.add(item.id)
      const entry = timersRef.current.get(item.id)
      if (entry) {
        clearTimeout(entry.timer)
        timersRef.current.delete(item.id)
      }
      item.onClose?.()
      setToasts((prev) =>
        prev.map((toast) => (toast.id === item.id ? { ...toast, exiting: true } : toast)),
      )
      timersRef.current.set(item.id, {
        timer: setTimeout(() => removeToast(item.id), EXIT_ANIMATION_MS + 50),
        start: 0,
        remaining: 0,
        item,
        paused: false,
      })
    },
    [removeToast],
  )

  const pauseEntry = useCallback((entry: ToastTimer) => {
    if (entry.paused) return
    clearTimeout(entry.timer)
    entry.remaining -= Date.now() - entry.start
    entry.paused = true
  }, [])

  const resumeEntry = useCallback(
    (entry: ToastTimer) => {
      if (!entry.paused) return
      entry.start = Date.now()
      entry.paused = false
      entry.timer = setTimeout(() => beginExit(entry.item), Math.max(entry.remaining, 0))
    },
    [beginExit],
  )

  const pauseTimer = useCallback(
    (id: string) => {
      if (exitingRef.current.has(id)) return
      const entry = timersRef.current.get(id)
      if (entry) pauseEntry(entry)
    },
    [pauseEntry],
  )

  const resumeTimer = useCallback(
    (id: string) => {
      if (exitingRef.current.has(id)) return
      const entry = timersRef.current.get(id)
      if (entry) resumeEntry(entry)
    },
    [resumeEntry],
  )

  useEffect(() => {
    if (!showToast) return
    counterRef.current += 1
    const id = `toast-${counterRef.current}`
    const onClose = onCloseRedirectUrl
      ? () => {
          const safeRedirectUrl = buildSafeNavigationUrl(onCloseRedirectUrl)
          if (safeRedirectUrl) {
            window.location.href = safeRedirectUrl
          }
        }
      : undefined
    const item: ToastItem = { id, type, message, onClose }
    setToasts((prev) => [item, ...prev])
    timersRef.current.set(id, {
      timer: setTimeout(() => beginExit(item), DEFAULT_AUTO_CLOSE),
      start: Date.now(),
      remaining: DEFAULT_AUTO_CLOSE,
      item,
      paused: false,
    })
    dispatch(updateToast(false, 'success', ''))
  }, [showToast])

  const pauseAll = useCallback(() => {
    timersRef.current.forEach((entry, id) => {
      if (!exitingRef.current.has(id)) pauseEntry(entry)
    })
  }, [pauseEntry])

  const resumeAll = useCallback(() => {
    timersRef.current.forEach((entry, id) => {
      if (!exitingRef.current.has(id)) resumeEntry(entry)
    })
  }, [resumeEntry])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setPaused(true)
        pauseAll()
      } else {
        setPaused(false)
        resumeAll()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [pauseAll, resumeAll])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((entry) => clearTimeout(entry.timer))
      timers.clear()
    }
  }, [])

  if (typeof document === 'undefined' || toasts.length === 0) {
    return null
  }

  return createPortal(
    <div
      className={classes.container}
      data-paused={paused || undefined}
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((item) => {
        const TypeIcon = ICON_BY_TYPE[item.type]
        const color = TOAST_TYPE_COLOR[item.type]
        return (
          <div
            key={item.id}
            className={`${classes.toast} ${item.exiting ? classes.toastExiting : ''}`}
            role="alert"
            onMouseEnter={() => pauseTimer(item.id)}
            onMouseLeave={() => resumeTimer(item.id)}
            onAnimationEnd={(e) => {
              if (e.target === e.currentTarget && item.exiting) {
                removeToast(item.id)
              }
            }}
          >
            <div className={classes.accentBar} style={{ backgroundColor: color }} aria-hidden />
            <TypeIcon className={classes.icon} style={{ color }} />
            <div className={classes.content}>
              {renderToastBody(t, item.type, item.message, classes.title)}
            </div>
            <button
              type="button"
              className={classes.closeButton}
              aria-label={t('actions.close')}
              title={t('actions.close')}
              onClick={() => beginExit(item)}
            >
              <Close fontSize="small" aria-hidden />
            </button>
            <div
              data-toast-progress
              className={classes.progressBar}
              style={{ backgroundColor: color, animationDuration: `${DEFAULT_AUTO_CLOSE}ms` }}
            />
          </div>
        )
      })}
    </div>,
    document.body,
  )
}

export default GluuToast
