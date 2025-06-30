import React, { createContext, useReducer, Dispatch, ReactNode } from 'react'

// Define the shape of the theme state
type ThemeState = {
  theme: string
}

// Define the shape of the actions for the reducer
type ThemeAction = {
  type: string
}

// Define the context value type
interface ThemeContextType {
  state: ThemeState
  dispatch: Dispatch<ThemeAction>
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const initialState: ThemeState = {
  theme:
    typeof window !== 'undefined'
      ? window.localStorage.getItem('initTheme') || 'darkBlack'
      : 'darkBlack',
}

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  if (action.type) {
    return { theme: action.type }
  }
  return state
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider(props: ThemeProviderProps) {
  const [state, dispatch] = useReducer(themeReducer, initialState)
  return <ThemeContext.Provider value={{ state, dispatch }}>{props.children}</ThemeContext.Provider>
}
