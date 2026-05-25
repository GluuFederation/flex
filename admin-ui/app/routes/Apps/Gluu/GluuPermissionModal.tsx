import { useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Close } from '@/components/icons'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import GluuText from './GluuText'
import { GluuButton } from '@/components'
import { useStyles } from './styles/GluuPermissionModal.style'
import { useStyles as useCommitDialogStyles } from './styles/GluuCommitDialog.style'
import type { GluuPermissionModalProps } from './types/GluuPermissionModal.types'

const GluuPermissionModal = ({ handler, isOpen }: GluuPermissionModalProps) => {
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
        handler()
      }
      e.stopPropagation()
    },
    [handler],
  )

  if (!isOpen) return null

  const modalContent = (
    <>
      <div className={commitClasses.overlay} aria-hidden />
      <div
        className={commitClasses.modalContainer}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="permission-modal-title"
      >
        <button
          type="button"
          onClick={handler}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <Close fontSize="small" aria-hidden />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText variant="h2" className={classes.title} id="permission-modal-title">
            <i className="bi bi-shield-lock" /> {t('dashboard.access_denied')}
          </GluuText>
          <div className={classes.modalBody}>
            <GluuText variant="p" className={classes.mutedText}>
              🚫 <strong>{t('dashboard.access_denied_message')}</strong>
            </GluuText>
            <GluuText variant="p">{t('dashboard.access_contact_admin')}</GluuText>
          </div>
          <div className={classes.buttonRow}>
            <GluuButton
              onClick={handler}
              backgroundColor={themeColors.formFooter.back.backgroundColor}
              textColor={themeColors.formFooter.back.textColor}
              borderColor="transparent"
              padding="8px 28px"
              minHeight="40"
              useOpacityOnHover
            >
              {t('menus.signout')}
            </GluuButton>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export default GluuPermissionModal
