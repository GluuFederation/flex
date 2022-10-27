import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import styles from './styles/GluuAlert.style'
import useAlert from 'Context/alert/useAlert'

export default function GluuGlobalAlert() {
  const classes = styles()
  const { title, text, severity, open, setAlert } = useAlert()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setAlert({ open: false, title, text, severity })
  }

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={7000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          <AlertTitle>{title}</AlertTitle>
          {text}
        </Alert>
      </Snackbar>
    </div>
  )
}
