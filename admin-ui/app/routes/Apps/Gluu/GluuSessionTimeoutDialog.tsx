import { use, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import styles from './styles/GluuSessionTimeoutDialog.style'
import { useStyles as useCommitDialogStyles } from './styles/GluuCommitDialog.style'
import { BUTTON_STYLES } from './styles/GluuThemeFormFooter.style'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { OPACITY } from '@/constants'
import { Close } from '@/components/icons'
import GluuText from './GluuText'
import { GluuButton } from '@/components'
import type { SessionTimeoutDialogProps } from './types'

const SessionTimeoutDialog = ({
  open,
  countdown,
  onLogout,
  onContinue,
  themeOverride,
}: SessionTimeoutDialogProps) => {
  const { t } = useTranslation()
  const theme = use(ThemeContext)
  const currentTheme = themeOverride ?? theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const isDark = currentTheme === THEME_DARK
  const { classes } = styles({ themeColors, isDark })
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  const { back: continueColors, cancel: logoutColors } = themeColors.formFooter

  if (!open) return null

  const modalContent = (
    <>
      <div className={commitClasses.overlay} aria-hidden />
      <div className={commitClasses.modalScroll} role="presentation">
        <div
          className={`${commitClasses.modalContainer} ${classes.modalContainer}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-timeout-title"
        >
          <button
            type="button"
            onClick={onContinue}
            className={commitClasses.closeButton}
            aria-label={t('actions.close')}
            title={t('actions.close')}
          >
            <Close fontSize="small" aria-hidden />
          </button>
          <div className={commitClasses.contentArea}>
            <GluuText variant="h2" className={commitClasses.title} id="session-timeout-title">
              {t('sessionTimeout.title')}
            </GluuText>
            <div className={classes.contentWrapper}>
              <GluuText variant="div" className={classes.contentText} disableThemeColor>
                {t('sessionTimeout.messageExpire', { count: countdown })}
              </GluuText>
              <GluuText variant="div" className={classes.contentText} disableThemeColor>
                {t('sessionTimeout.messageContinue')}
              </GluuText>
            </div>
            <div className={classes.buttonRow}>
              <GluuButton
                onClick={onContinue}
                backgroundColor={continueColors.backgroundColor}
                textColor={continueColors.textColor}
                borderColor={continueColors.borderColor}
                padding={`${BUTTON_STYLES.paddingY}px ${BUTTON_STYLES.paddingX}px`}
                minHeight={BUTTON_STYLES.height}
                fontWeight={BUTTON_STYLES.fontWeight}
                useOpacityOnHover
                hoverOpacity={OPACITY.OVERLAY}
              >
                {t('sessionTimeout.continueSession')}
              </GluuButton>
              <GluuButton
                onClick={onLogout}
                outlined
                backgroundColor={logoutColors.backgroundColor}
                textColor={logoutColors.textColor}
                borderColor={logoutColors.borderColor}
                padding={`${BUTTON_STYLES.paddingY}px ${BUTTON_STYLES.paddingX}px`}
                minHeight={BUTTON_STYLES.height}
                fontWeight={BUTTON_STYLES.fontWeight}
                useOpacityOnHover
                hoverOpacity={OPACITY.OVERLAY}
              >
                {t('sessionTimeout.logout')}
              </GluuButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export default SessionTimeoutDialog
