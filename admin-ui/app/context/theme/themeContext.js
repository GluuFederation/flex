import React, { createContext, useReducer } from "react"

export const ThemeContext = createContext()

const initialState = {
  theme: window.localStorage.getItem('initTheme') || 'darkBlack',
}

const themeReducer = (state, action) => {
  if (action.type) {
    window.localStorage.setItem('initTheme', action.type)
    return { theme: action.type }
  }

  return state
}

export function ThemeProvider(props) {
  const [state, dispatch] = useReducer(themeReducer, initialState)

  return <ThemeContext.Provider value={{ state, dispatch }}>{props.children}</ThemeContext.Provider>
}
