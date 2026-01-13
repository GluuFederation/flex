import React, { createContext, useReducer, useContext, Dispatch, ReactNode } from 'react'

// Define the shape of the theme state
type ThemeState = {
  theme: string
}

// Define the shape of the actions for the reducer
type ThemeAction = {
  type: string
}

// Define the context value type
export interface ThemeContextType {
  state: ThemeState
  dispatch: Dispatch<ThemeAction>
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Get initial theme from localStorage
// Priority: 1) userConfig (user-specific), 2) initTheme (global), 3) default 'light'
const getInitialTheme = (): string => {
  if (typeof window === 'undefined') return 'light'

  // First, try to get user-specific theme from userConfig
  try {
    const userConfigStr = window.localStorage.getItem('userConfig')
    if (userConfigStr) {
      const userConfig = JSON.parse(userConfigStr)
      if (userConfig?.theme && typeof userConfig.theme === 'object') {
        const themeValues = Object.values(userConfig.theme)
        if (themeValues.length > 0 && typeof themeValues[0] === 'string') {
          const userTheme = themeValues[0] as string
          if (userTheme === 'light' || userTheme === 'dark') {
            window.localStorage.setItem('initTheme', userTheme)
            return userTheme
          }
        }
      }
    }
  } catch {
    // Silent fail, fallback to initTheme
  }

  // Fallback to initTheme
  const savedTheme = window.localStorage.getItem('initTheme')

  if (!savedTheme) return 'light'

  // If saved theme is one of the old themes, migrate to light and save
  const oldThemes = ['darkBlack', 'darkBlue', 'lightBlue', 'lightGreen']
  if (oldThemes.includes(savedTheme)) {
    window.localStorage.setItem('initTheme', 'light')
    return 'light'
  }

  // Return saved theme if it's valid (light or dark)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  // Invalid theme, default to light
  window.localStorage.setItem('initTheme', 'light')
  return 'light'
}

const initialState: ThemeState = {
  theme: getInitialTheme(),
}

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  if (action.type) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('initTheme', action.type)
    }
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

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
