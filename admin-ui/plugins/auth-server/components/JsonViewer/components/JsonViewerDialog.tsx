import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Close } from '@/components/icons'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useAppDispatch } from '@/redux/hooks'
import { useTheme } from '@/context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { updateToast } from '@/redux/features/toastSlice'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { devLogger } from '@/utils/devLogger'
import JsonViewer from './JsonViewer'
import { useStyles } from './styles/JsonViewerDialog.style'
import type { JsonViewerDialogProps } from '../types'

const JsonViewerDialog: FC<JsonViewerDialogProps> = ({
  isOpen,
  toggle,
  data,
  isLoading = false,
  title = 'JSON View',
  theme: themeProp,
  expanded = true,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { state: themeState } = useTheme()
  const selectedTheme = themeProp || themeState.theme || DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })
  const { classes } = useStyles({ isDark, themeColors })

  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const handleClose = useCallback(() => {
    setIsCopied(false)
    previouslyFocusedElementRef.current?.focus()
    toggle()
  }, [toggle])

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    dialogRef.current?.focus()

    return () => {
      previouslyFocusedElementRef.current?.focus()
    }
  }, [isOpen])

  const trapFocusWithinDialog = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return

    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors),
    ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')

    if (focusable.length === 0) {
      e.preventDefault()
      return
    }

    const firstElement = focusable[0]
    const lastElement = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }, [])

  const copyToClipboard = useCallback(async () => {
    if (isCopied || data === undefined) return
    try {
      const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err)
      devLogger.error('Failed to copy to clipboard:', err instanceof Error ? err : String(err))
      dispatch(updateToast(true, 'error', `Failed to copy to clipboard: ${detail}`))
    }
  }, [data, isCopied, dispatch])

  const handleOverlayKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
    },
    [handleClose],
  )

  const handleModalKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        handleClose()
      }
      trapFocusWithinDialog(e)
    },
    [handleClose, trapFocusWithinDialog],
  )

  if (!isOpen) return null

  const copyLabel = isCopied ? t('messages.copied') : t('actions.copy_to_clipboard')

  const modalContent = (
    <>
      <button
        type="button"
        className={commitClasses.overlay}
        onClick={handleClose}
        onKeyDown={handleOverlayKeyDown}
        aria-label={t('actions.close')}
      />
      <div
        ref={dialogRef}
        className={`${commitClasses.modalContainer} ${classes.modalContainer}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby="json-viewer-title"
      >
        <button
          type="button"
          onClick={handleClose}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <Close fontSize="small" aria-hidden />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText variant="h2" className={commitClasses.title} id="json-viewer-title">
            {title}
          </GluuText>
          <div className={classes.viewerBody}>
            {data !== undefined ? (
              <JsonViewer
                data={data}
                theme={selectedTheme}
                expanded={expanded}
                backgroundColor={themeColors.card.background}
              />
            ) : (
              <div className={classes.viewerPlaceholder} aria-hidden="true" />
            )}
          </div>
          <GluuThemeFormFooter
            showApply
            applyButtonType="button"
            applyButtonLabel={copyLabel}
            onApply={copyToClipboard}
            disableApply={isCopied || data === undefined || isLoading}
            className={classes.footer}
          />
        </div>
      </div>
    </>
  )

  return createPortal(<GluuLoader blocking={isLoading}>{modalContent}</GluuLoader>, document.body)
}

JsonViewerDialog.displayName = 'JsonViewerDialog'

export default memo(JsonViewerDialog)
