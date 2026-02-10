import React, { useState, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import styles from './styles/GluuAlert.style'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

interface GluuAlertProps {
  severity?: AlertProps['severity']
  message?: string
  show?: boolean
}

export default function GluuAlert({ severity, message, show }: GluuAlertProps) {
  const { classes } = styles()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(!!show)
  }, [!!show])

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
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
