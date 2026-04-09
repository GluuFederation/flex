import { memo, useState, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { useTheme } from '@/context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { updateToast } from '@/redux/features/toastSlice'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import { devLogger } from '@/utils/devLogger'
import customColors from '@/customColors'
import JsonViewer from './JsonViewer'
import { useStyles } from './JsonViewerDialog.style'
import type { JsonViewerDialogProps } from './types'

const JsonViewerDialog: React.FC<JsonViewerDialogProps> = ({
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

  const [isCopied, setIsCopied] = useState(false)

  const handleClose = useCallback(() => {
    setIsCopied(false)
    toggle()
  }, [toggle])

  const copyToClipboard = useCallback(async () => {
    if (isCopied || !data) return
    try {
      const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err)
      devLogger.error('Failed to copy to clipboard:', err)
      dispatch(updateToast(true, 'error', `Failed to copy to clipboard: ${detail}`))
    }
  }, [data, isCopied, dispatch])

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
    },
    [handleClose],
  )

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        handleClose()
      }
    },
    [handleClose],
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
        className={`${commitClasses.modalContainer} ${classes.modalContainer}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
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
          <i className="fa fa-times" aria-hidden="true" />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText variant="h2" className={commitClasses.title} id="json-viewer-title">
            {title}
          </GluuText>
          <div className={classes.viewerBody}>
            {isLoading ? (
              <div className={classes.loadingContainer}>
                <i className="fa fa-spinner fa-spin fa-2x" style={{ color: customColors.logo }} />
                <p className={classes.loadingText}>{t('messages.request_waiting_message')}</p>
              </div>
            ) : data ? (
              <JsonViewer data={data} theme={selectedTheme} expanded={expanded} />
            ) : null}
          </div>
          <div className={classes.footerWrap}>
            <GluuFormFooter
              showApply
              applyButtonType="button"
              applyButtonLabel={copyLabel}
              onApply={copyToClipboard}
              disableApply={isCopied || !data || isLoading}
              applyIconClass="fa fa-copy"
            />
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

JsonViewerDialog.displayName = 'JsonViewerDialog'

export default memo(JsonViewerDialog)
