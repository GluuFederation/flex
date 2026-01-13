import React, { createContext, useReducer, useContext, Dispatch, ReactNode, useEffect } from 'react'

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

// Get initial theme from localStorage (pure function, no side effects)
// Priority: 1) userConfig (user-specific), 2) initTheme (global), 3) default 'light'
const getInitialTheme = (): string => {
  if (typeof window === 'undefined') return 'light'

  // First, try to get user-specific theme from userConfig
  try {
    const userConfigStr = window.localStorage.getItem('userConfig')
    if (userConfigStr) {
      const userConfig = JSON.parse(userConfigStr)
      // Handle both object format { [inum]: 'light' } and direct string format
      if (userConfig?.theme) {
        let userTheme: string | undefined
        if (typeof userConfig.theme === 'string') {
          userTheme = userConfig.theme
        } else if (typeof userConfig.theme === 'object') {
          const themeValues = Object.values(userConfig.theme)
          if (themeValues.length > 0 && typeof themeValues[0] === 'string') {
            userTheme = themeValues[0] as string
          }
        }
        if (userTheme === 'light' || userTheme === 'dark') {
          return userTheme
        }
      }
    }
  } catch (e) {
    // Silent fail, fallback to initTheme
    console.debug('Failed to parse userConfig:', e)
  }

  // Fallback to initTheme
  const savedTheme = window.localStorage.getItem('initTheme')

  if (!savedTheme) return 'light'

  // Return saved theme if it's valid (light or dark)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  // Invalid theme, default to light
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

  // Handle theme persistence in useEffect (side effects)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Migrate userConfig theme to initTheme if needed
    try {
      const userConfigStr = window.localStorage.getItem('userConfig')
      if (userConfigStr) {
        const userConfig = JSON.parse(userConfigStr)
        if (userConfig?.theme) {
          let userTheme: string | undefined
          if (typeof userConfig.theme === 'string') {
            userTheme = userConfig.theme
          } else if (typeof userConfig.theme === 'object') {
            const themeValues = Object.values(userConfig.theme)
            if (themeValues.length > 0 && typeof themeValues[0] === 'string') {
              userTheme = themeValues[0] as string
            }
          }
          if (userTheme === 'light' || userTheme === 'dark') {
            const currentInitTheme = window.localStorage.getItem('initTheme')
            if (currentInitTheme !== userTheme) {
              window.localStorage.setItem('initTheme', userTheme)
            }
          }
        }
      }
    } catch (e) {
      console.debug('Failed to migrate userConfig theme:', e)
      // Ensure we have a valid theme set
      const currentTheme = window.localStorage.getItem('initTheme')
      if (!currentTheme || !['light', 'dark'].includes(currentTheme)) {
        window.localStorage.setItem('initTheme', 'light')
      }
    }

    // Ensure invalid themes are migrated to light
    const currentTheme = window.localStorage.getItem('initTheme')
    if (currentTheme && !['light', 'dark'].includes(currentTheme)) {
      window.localStorage.setItem('initTheme', 'light')
    }
  }, [])

  return <ThemeContext.Provider value={{ state, dispatch }}>{props.children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
