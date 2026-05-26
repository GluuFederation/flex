import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import GluuText from './GluuText'
import { GluuButton } from '@/components'
import { GluuModalShell } from '@/components/GluuModalShell'
import { useStyles } from './styles/GluuPermissionModal.style'
import type { GluuPermissionModalProps } from './types/GluuPermissionModal.types'

const GluuPermissionModal = ({ handler, isOpen }: GluuPermissionModalProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })

  if (!isOpen) return null

  return (
    <GluuModalShell
      onClose={handler}
      ariaLabelledBy="permission-modal-title"
      closeOnOverlayClick={false}
    >
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
    </GluuModalShell>
  )
}

export default GluuPermissionModal
