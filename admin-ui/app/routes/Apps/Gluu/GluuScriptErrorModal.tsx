import { memo, useContext, useState, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import GluuThemeFormFooter from './GluuThemeFormFooter'
import GluuText from './GluuText'
import { useStyles } from './styles/GluuScriptErrorModal.style'
import { useStyles as useCommitDialogStyles } from './styles/GluuCommitDialog.style'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { devLogger } from '@/utils/devLogger'
import type { GluuScriptErrorModalProps } from './types'

const GluuScriptErrorModal = ({
  title = 'Error',
  error,
  isOpen,
  handler,
}: GluuScriptErrorModalProps) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const [isCopied, setIsCopied] = useState(false)
  const selectedTheme = theme?.state.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  const handleClose = useCallback(() => {
    setIsCopied(false)
    handler()
  }, [handler])

  const copyToClipboard = useCallback(async () => {
    if (isCopied) return
    try {
      await navigator.clipboard.writeText(error)
      setIsCopied(true)
    } catch (clipboardError) {
      devLogger.error(
        'Failed to copy script error to clipboard:',
        clipboardError instanceof Error ? clipboardError : String(clipboardError),
      )
    }
  }, [error, isCopied])

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
        handleClose()
      }
      e.stopPropagation()
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
        aria-labelledby="script-error-title"
      >
        <button
          type="button"
          onClick={handleClose}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <i className="fa fa-times" aria-hidden />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText variant="h2" className={commitClasses.title} id="script-error-title">
            {title}
          </GluuText>
          <div className={classes.errorBody}>
            <GluuText variant="p" disableThemeColor className={classes.errorText}>
              {error}
            </GluuText>
          </div>
          <GluuThemeFormFooter
            showApply
            applyButtonType="button"
            applyButtonLabel={copyLabel}
            onApply={copyToClipboard}
            disableApply={isCopied}
          />
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export default memo(GluuScriptErrorModal)
