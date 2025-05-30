// @ts-nocheck
import React, { useState, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import styles from './styles/GluuAlert.style'
import MuiAlert from '@mui/material/Alert'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

export default function GluuAlert({ severity, message, show }) {
  const classes = styles()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(!!show)
  }, [!!show])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}
