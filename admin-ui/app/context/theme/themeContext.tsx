import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  ReactNode,
  useEffect,
  useRef,
} from 'react'
import { DEFAULT_THEME, isValidTheme, type ThemeValue } from './constants'
import { isDevelopment } from '@/utils/env'

type ThemeState = {
  theme: ThemeValue
}

type ThemeAction = {
  type: ThemeValue
}

export interface ThemeContextType {
  state: ThemeState
  dispatch: Dispatch<ThemeAction>
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const extractUserTheme = (currentInum?: string | null): ThemeValue => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  try {
    const userConfigStr = window.localStorage.getItem('userConfig')
    if (!userConfigStr) {
      return DEFAULT_THEME
    }

    const userConfig = JSON.parse(userConfigStr) as { theme?: string | Record<string, string> }
    if (!userConfig?.theme) {
      return DEFAULT_THEME
    }

    let userTheme: string | undefined

    if (typeof userConfig.theme === 'string') {
      userTheme = userConfig.theme
    } else if (typeof userConfig.theme === 'object' && currentInum) {
      userTheme = userConfig.theme[currentInum]
    }

    if (userTheme && isValidTheme(userTheme)) {
      return userTheme
    }

    return DEFAULT_THEME
  } catch (e) {
    if (isDevelopment) {
      console.error('Failed to extract user theme, using default:', e)
    }
    return DEFAULT_THEME
  }
}

const getInitialTheme = (): ThemeValue => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  try {
    const savedTheme = window.localStorage.getItem('initTheme')
    if (savedTheme && isValidTheme(savedTheme)) {
      return savedTheme
    }

    const userTheme = extractUserTheme()
    if (userTheme !== DEFAULT_THEME) {
      window.localStorage.setItem('initTheme', userTheme)
      return userTheme
    }

    window.localStorage.setItem('initTheme', DEFAULT_THEME)
    return DEFAULT_THEME
  } catch (e) {
    if (isDevelopment) {
      console.error('Failed to get initial theme, using default:', e)
    }
    try {
      window.localStorage.setItem('initTheme', DEFAULT_THEME)
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_THEME
  }
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

const getUserInum = (): string | null => {
  try {
    const userInfoStr = window.localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr) as { inum?: string }
      return userInfo?.inum || null
    }
  } catch {
    // Ignore parsing errors
  }
  return null
}

export function ThemeProvider(props: ThemeProviderProps) {
  const [state, dispatch] = useReducer(themeReducer, initialState)
  const hasSyncedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || hasSyncedRef.current) return

    try {
      const savedTheme = window.localStorage.getItem('initTheme')
      if (savedTheme && isValidTheme(savedTheme)) {
        dispatch({ type: savedTheme })
        hasSyncedRef.current = true
        return
      }

      const currentInum = getUserInum()
      const userTheme = extractUserTheme(currentInum)

      if (userTheme !== DEFAULT_THEME) {
        window.localStorage.setItem('initTheme', userTheme)
        dispatch({ type: userTheme })
      } else {
        window.localStorage.setItem('initTheme', DEFAULT_THEME)
        dispatch({ type: DEFAULT_THEME })
      }

      hasSyncedRef.current = true
    } catch (e) {
      if (isDevelopment) {
        console.error('Failed to sync theme in useEffect, ensuring default:', e)
      }
      try {
        const currentTheme = window.localStorage.getItem('initTheme')
        if (!currentTheme || !isValidTheme(currentTheme)) {
          window.localStorage.setItem('initTheme', DEFAULT_THEME)
          dispatch({ type: DEFAULT_THEME })
        } else {
          dispatch({ type: currentTheme })
        }
        hasSyncedRef.current = true
      } catch (error) {
        if (isDevelopment) {
          console.error(error)
        }
      }
    }
  }, [])

  // Toggle theme class on html; variable values are defined in main.scss (theme-dark / theme-light)
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.remove('theme-dark', 'theme-light')
    document.documentElement.classList.add(`theme-${state.theme}`)
  }, [state.theme])

  return <ThemeContext.Provider value={{ state, dispatch }}>{props.children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
