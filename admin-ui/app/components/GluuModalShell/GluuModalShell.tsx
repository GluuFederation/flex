import React, { useCallback, use, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Close } from '@/components/icons'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { useStyles as useCommitDialogStyles } from '@/routes/Apps/Gluu/styles/GluuCommitDialog.style'
import type { GluuModalShellProps } from './types'

const GluuModalShell = ({
  onClose,
  ariaLabelledBy,
  closeOnOverlayClick = true,
  children,
}: GluuModalShellProps) => {
  const { t } = useTranslation()
  const theme = use(ThemeContext)
  const selectedTheme = theme?.state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      e.stopPropagation()
    },
    [onClose],
  )

  const overlay = closeOnOverlayClick ? (
    <button
      type="button"
      className={commitClasses.overlay}
      onClick={onClose}
      aria-label={t('actions.close')}
    />
  ) : (
    <div className={commitClasses.overlay} aria-hidden />
  )

  return createPortal(
    <>
      {overlay}
      <div
        className={commitClasses.modalScroll}
        onClick={(e) => {
          if (closeOnOverlayClick && e.target === e.currentTarget) onClose()
        }}
        role="presentation"
      >
        <div
          className={commitClasses.modalContainer}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          tabIndex={-1}
          aria-labelledby={ariaLabelledBy}
        >
          <button
            type="button"
            onClick={onClose}
            className={commitClasses.closeButton}
            aria-label={t('actions.close')}
            title={t('actions.close')}
          >
            <Close fontSize="small" aria-hidden />
          </button>
          <div className={commitClasses.contentArea}>{children}</div>
        </div>
      </div>
    </>,
    document.body,
  )
}

export default GluuModalShell
