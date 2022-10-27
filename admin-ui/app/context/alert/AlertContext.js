import React from 'react'
import { createContext, useState } from 'react'

const initialState = {
  title: '',
  text: '',
  type: '',
}

const AlertContext = createContext({
  ...initialState,
  setAlert: () => {},
})

export const AlertProvider = ({ children }) => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [type, setType] = useState('')
  const [open, setOpen] = useState('')

  const setAlert = (alertParams) => {
    const { open, type, title, text } = alertParams
    setOpen(open)
    setType(type)
    setTitle(title)
    setText(text)
  }

  return (
    <AlertContext.Provider
      value={{
        open,
        title,
        text,
        type,
        setAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}

export default AlertContext