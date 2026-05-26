import { useContext, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import styles from './styles/GluuSessionTimeoutDialog.style'
import { useStyles as useCommitDialogStyles } from './styles/GluuCommitDialog.style'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import GluuText from './GluuText'
import { GluuButton } from '@/components/GluuButton'
import type { SessionTimeoutDialogProps } from './types'

export type { SessionTimeoutDialogProps }

const SessionTimeoutDialog = ({
  open,
  countdown,
  onLogout,
  onContinue,
  themeOverride,
}: SessionTimeoutDialogProps) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const currentTheme = themeOverride ?? theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const isDark = currentTheme === THEME_DARK
  const { classes } = styles({ themeColors, isDark })
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  if (!open) return null

  // No overlay-click or Escape close: a session timeout warning must force an
  // explicit choice between logging out and continuing the session.
  const modalContent = (
    <>
      <div className={commitClasses.overlay} aria-hidden />
      <div
        className={classes.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-timeout-title"
      >
        <div className={classes.titleWrapper}>
          <GluuText
            variant="h6"
            className={classes.title}
            id="session-timeout-title"
            disableThemeColor
          >
            {t('sessionTimeout.title')}
          </GluuText>
        </div>
        <div className={classes.contentWrapper}>
          <GluuText className={classes.contentText} variant="div" disableThemeColor>
            {t('sessionTimeout.messageExpire', { count: countdown })}
          </GluuText>
          <GluuText className={classes.contentText} variant="div" disableThemeColor>
            {t('sessionTimeout.messageContinue')}
          </GluuText>
        </div>
        <div className={classes.actionArea}>
          <GluuButton
            onClick={onLogout}
            className={clsx(classes.logout, classes.button)}
            backgroundColor={themeColors.formFooter?.back?.backgroundColor}
            textColor={themeColors.formFooter?.back?.textColor}
            borderColor={themeColors.formFooter?.back?.backgroundColor}
            disableHoverStyles
          >
            {t('sessionTimeout.logout')}
          </GluuButton>
          <GluuButton
            onClick={onContinue}
            outlined
            className={clsx(classes.continue, classes.button)}
            backgroundColor={themeColors.formFooter?.cancel?.backgroundColor}
            borderColor={themeColors.formFooter?.cancel?.borderColor ?? themeColors.borderColor}
            textColor={themeColors.formFooter?.cancel?.textColor ?? themeColors.fontColor}
            disableHoverStyles
          >
            {t('sessionTimeout.continueSession')}
          </GluuButton>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export default SessionTimeoutDialog
