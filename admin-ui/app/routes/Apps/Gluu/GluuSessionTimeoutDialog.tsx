import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogTitle, DialogContent, DialogActions, Slide, SlideProps } from '@mui/material'
import clsx from 'clsx'
import styles from './styles/GluuSessionTimeoutDialog.style'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import GluuText from './GluuText'
import { GluuButton } from '@/components/GluuButton'

export interface SessionTimeoutDialogProps {
  open: boolean
  countdown: number
  onLogout: () => void
  onContinue: () => void
  themeOverride?: 'light' | 'dark'
}

const Transition = React.forwardRef<HTMLDivElement, SlideProps>((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />
})

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

  return (
    <Dialog open={open} classes={{ paper: classes.dialog }} TransitionComponent={Transition}>
      <DialogTitle className={classes.titleWrapper} sx={{ p: 0, mb: 1 }}>
        <GluuText variant="h6" className={classes.title} disableThemeColor>
          {t('sessionTimeout.title')}
        </GluuText>
      </DialogTitle>
      <DialogContent className={classes.contentWrapper} sx={{ p: 0 }}>
        <GluuText className={classes.contentText} variant="div" disableThemeColor>
          {t('sessionTimeout.messageExpire', { count: countdown })}
        </GluuText>
        <GluuText className={classes.contentText} variant="div" disableThemeColor>
          {t('sessionTimeout.messageContinue')}
        </GluuText>
      </DialogContent>
      <DialogActions className={classes.actionArea} sx={{ p: 0 }}>
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
      </DialogActions>
    </Dialog>
  )
}

export default SessionTimeoutDialog
