import React, { useContext } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Slide,
  SlideProps,
} from '@mui/material'
import { Button } from 'Components'
import clsx from 'clsx'
import styles from './styles/GluuSessionTimeoutDialog.style'
import { ThemeContext } from 'Context/theme/themeContext'

const Transition = React.forwardRef<HTMLDivElement, SlideProps>((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />
})

const SessionTimeoutDialog = ({ open, countdown, onLogout, onContinue }: any) => {
  const themeContext: any = useContext(ThemeContext)
  const isDark = themeContext.state.theme === 'dark'
  const { classes } = styles({ isDark })

  return (
    <Dialog open={open} classes={{ paper: classes.dialog }} TransitionComponent={Transition}>
      <DialogTitle className={classes.title} sx={{ p: 0, mb: 1.5 }}>
        Session Timeout
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Typography className={classes.contentText}>
          The current session is about to expire in <span>{countdown}</span> seconds.
        </Typography>
        <Typography
          className={classes.contentText}
        >{`Would you like to continue the session?`}</Typography>
      </DialogContent>
      <DialogActions className={classes.actionArea} sx={{ p: 0 }}>
        <Button
          onClick={onLogout}
          variant="contained"
          className={clsx(classes.logout, classes.button)}
          color="success"
        >
          Logout
        </Button>
        <Button
          onClick={onContinue}
          variant="outlined"
          className={clsx(classes.continue, classes.button)}
        >
          Continue Session
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SessionTimeoutDialog
