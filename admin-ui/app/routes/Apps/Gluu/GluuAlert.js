import React, { useState, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/lab/Alert'
import styles from './styles/GluuAlert.style'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

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
