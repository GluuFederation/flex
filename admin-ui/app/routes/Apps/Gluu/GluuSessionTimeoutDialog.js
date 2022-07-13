import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slide
} from "@material-ui/core"
import clsx from "clsx"
import styles from "./styles/GluuSessionTimeoutDialog.style"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const SessionTimeoutDialog = ({ open, countdown, onLogout, onContinue }) => {
  const classes = styles()

  return (
    <Dialog
      open={open}
      classes={{ paper: classes.dialog }}
      TransitionComponent={Transition}
    >
      <DialogTitle>
        Session Timeout
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          The current session is about to expire in{" "}
          <span className={classes.countdown}>{countdown}</span> seconds.
        </Typography>
        <Typography variant="body2">{`Would you like to continue the session?`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onLogout}
          variant="contained"
          className={clsx(classes.logout, classes.button)}
        >
          Logout
        </Button>
        <Button
          onClick={onContinue}
          color="primary"
          variant="contained"
          className={classes.button}
        >
          Continue Session
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SessionTimeoutDialog