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

const extractUserTheme = (currentInum?: string | null): string | undefined => {
  if (typeof window === 'undefined') return undefined

  try {
    const userConfigStr = window.localStorage.getItem('userConfig')
    if (!userConfigStr) return undefined

    const userConfig = JSON.parse(userConfigStr)
    if (!userConfig?.theme) return undefined

    let userTheme: string | undefined

    if (typeof userConfig.theme === 'string') {
      userTheme = userConfig.theme
    } else if (typeof userConfig.theme === 'object') {
      // If currentInum is available, use it; otherwise fall back to first value
      if (currentInum && userConfig.theme[currentInum]) {
        userTheme = userConfig.theme[currentInum]
      } else {
        const themeValues = Object.values(userConfig.theme)
        if (themeValues.length > 0 && typeof themeValues[0] === 'string') {
          userTheme = themeValues[0] as string
        }
      }
    }

    // Validate theme value
    if (userTheme === 'light' || userTheme === 'dark') {
      return userTheme
    }
  } catch (e) {
    console.debug('Failed to parse userConfig:', e)
  }

  return undefined
}

// Get initial theme from localStorage (pure function, no side effects)
// Priority: 1) userConfig (user-specific), 2) initTheme (global), 3) default 'light'
// Note: currentInum is not available at initialization time, so we use first value
// The useEffect will update with the correct user's theme when user context is available
const getInitialTheme = (): string => {
  if (typeof window === 'undefined') return 'light'

  // Try to get user-specific theme from userConfig
  const userTheme = extractUserTheme()
  if (userTheme) {
    return userTheme
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

    // Try to get current user's inum from localStorage if available
    // This is a fallback; ideally inum should be passed from user context
    let currentInum: string | null = null
    try {
      const userInfoStr = window.localStorage.getItem('userInfo')
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        currentInum = userInfo?.inum || null
      }
    } catch {
      // Ignore parsing errors
    }

    // Extract user theme using the shared helper
    const userTheme = extractUserTheme(currentInum)
    if (userTheme) {
      const currentInitTheme = window.localStorage.getItem('initTheme')
      if (currentInitTheme !== userTheme) {
        window.localStorage.setItem('initTheme', userTheme)
      }
    }

    // Ensure invalid themes are migrated to light
    const currentTheme = window.localStorage.getItem('initTheme')
    if (!currentTheme || !['light', 'dark'].includes(currentTheme)) {
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
