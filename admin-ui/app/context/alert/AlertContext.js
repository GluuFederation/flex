import React from 'react'
import { createContext, useState } from 'react'

const initialState = {
  open: false,
  title: '',
  text: '',
  severity: '',
}

const AlertContext = createContext({
  ...initialState,
  setAlert: () => {},
})

export const AlertProvider = ({ children }) => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [severity, setSeverity] = useState('')
  const [open, setOpen] = useState('')

  const setAlert = (alertParams) => {
    const { open, severity, title, text } = alertParams
    setOpen(open)
    setSeverity(severity)
    setTitle(title)
    setText(text)
  }

  return (
    <AlertContext.Provider
      value={{
        open,
        title,
        text,
        severity,
        setAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}

export default AlertContext