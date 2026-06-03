import { useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Close } from '@/components/icons'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { GluuButton } from '@/components'
import { useStyles } from './styles/GluuViewDetailsModal.style'
import { useStyles as useCommitDialogStyles } from './styles/GluuCommitDialog.style'
import type { GluuViewDetailModalProps } from './types'

const GluuViewDetailModal = ({
  children,
  isOpen,
  handleClose,
  hideFooter = false,
  title,
  contentClassName = '',
  contentStyle,
  headerClassName = '',
  headerStyle,
  modalClassName = '',
  modalStyle,
  customHeader,
}: GluuViewDetailModalProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

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

  const displayTitle = title ?? t('messages.details')

  const modalContent = (
    <>
      <button
        type="button"
        className={commitClasses.overlay}
        onClick={handleClose}
        aria-label={t('actions.close')}
      />
      <div
        className={commitClasses.modalScroll}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose()
        }}
        role="presentation"
      >
        <div
          className={`${classes.modalContainer} ${modalClassName}`.trim()}
          style={modalStyle}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          tabIndex={-1}
          aria-label={typeof displayTitle === 'string' ? displayTitle : undefined}
        >
          {customHeader ?? (
            <>
              <button
                type="button"
                onClick={handleClose}
                className={commitClasses.closeButton}
                aria-label={t('actions.close')}
                title={t('actions.close')}
              >
                <Close fontSize="small" aria-hidden />
              </button>
              <div className={`${classes.header} ${headerClassName}`.trim()} style={headerStyle}>
                {displayTitle}
              </div>
            </>
          )}
          <div className={`${classes.content} ${contentClassName}`.trim()} style={contentStyle}>
            {children}
          </div>
          {!hideFooter && (
            <div className={classes.footer}>
              <GluuButton
                onClick={handleClose}
                backgroundColor={themeColors.formFooter.back.backgroundColor}
                textColor={themeColors.formFooter.back.textColor}
                borderColor="transparent"
                padding="8px 28px"
                minHeight="40"
                useOpacityOnHover
              >
                {t('actions.close')}
              </GluuButton>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export default GluuViewDetailModal
