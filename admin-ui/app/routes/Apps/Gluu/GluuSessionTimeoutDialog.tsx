import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogTitle, DialogContent, DialogActions, Slide, SlideProps } from '@mui/material'
import clsx from 'clsx'
import styles from './styles/GluuSessionTimeoutDialog.style'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import GluuText from './GluuText'
import { GluuButton } from '@/components/GluuButton'

export interface SessionTimeoutDialogProps {
  open: boolean
  countdown: number
  onLogout: () => void
  onContinue: () => void
}

const Transition = React.forwardRef<HTMLDivElement, SlideProps>((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />
})

const SessionTimeoutDialog = ({
  open,
  countdown,
  onLogout,
  onContinue,
}: SessionTimeoutDialogProps) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = styles({ themeColors })

  return (
    <Dialog open={open} classes={{ paper: classes.dialog }} TransitionComponent={Transition}>
      <DialogTitle className={classes.title} sx={{ p: 0, mb: 1.5 }}>
        <GluuText variant="h6">{t('sessionTimeout.title')}</GluuText>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <GluuText className={classes.contentText} variant="div">
          {t('sessionTimeout.messageExpire', { count: countdown })}
        </GluuText>
        <GluuText className={classes.contentText} variant="div">
          {t('sessionTimeout.messageContinue')}
        </GluuText>
      </DialogContent>
      <DialogActions className={classes.actionArea} sx={{ p: 0 }}>
        <GluuButton
          onClick={onLogout}
          className={clsx(classes.logout, classes.button)}
          backgroundColor={themeColors.settings?.removeButton?.bg}
          textColor={themeColors.settings?.removeButton?.text}
        >
          {t('sessionTimeout.logout')}
        </GluuButton>
        <GluuButton
          onClick={onContinue}
          outlined
          className={clsx(classes.continue, classes.button)}
        >
          {t('sessionTimeout.continueSession')}
        </GluuButton>
      </DialogActions>
    </Dialog>
  )
}

export default SessionTimeoutDialog
