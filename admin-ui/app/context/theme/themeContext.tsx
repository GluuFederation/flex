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
    console.debug('Failed to extract user theme, using default:', e)
    return DEFAULT_THEME
  }
}

const getInitialTheme = (): ThemeValue => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  try {
    const userTheme = extractUserTheme()
    const savedTheme = window.localStorage.getItem('initTheme')

    if (userTheme === DEFAULT_THEME && savedTheme && isValidTheme(savedTheme)) {
      return savedTheme
    }

    if (savedTheme !== userTheme) {
      window.localStorage.setItem('initTheme', userTheme)
    }
    return userTheme
  } catch (e) {
    console.debug('Failed to get initial theme, using default:', e)
    try {
      window.localStorage.setItem('initTheme', DEFAULT_THEME)
    } catch (_error) {
      void _error
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

export function ThemeProvider(props: ThemeProviderProps) {
  const [state, dispatch] = useReducer(themeReducer, initialState)
  const hasSyncedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || hasSyncedRef.current) return

    try {
      let currentInum: string | null = null
      try {
        const userInfoStr = window.localStorage.getItem('userInfo')
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr) as { inum?: string }
          currentInum = userInfo?.inum || null
        }
      } catch (_error) {
        void _error
      }

      const userTheme = extractUserTheme(currentInum)
      const savedTheme = window.localStorage.getItem('initTheme')
      if (savedTheme !== userTheme) {
        window.localStorage.setItem('initTheme', userTheme)
      }

      const finalTheme = window.localStorage.getItem('initTheme')
      const resolvedTheme = finalTheme && isValidTheme(finalTheme) ? finalTheme : DEFAULT_THEME

      if (resolvedTheme !== state.theme) {
        dispatch({ type: resolvedTheme })
      }

      hasSyncedRef.current = true
    } catch (e) {
      console.debug('Failed to sync theme in useEffect, ensuring default:', e)
      try {
        window.localStorage.setItem('initTheme', DEFAULT_THEME)
        if (state.theme !== DEFAULT_THEME) {
          dispatch({ type: DEFAULT_THEME })
        }
        hasSyncedRef.current = true
      } catch (_error) {
        void _error
      }
    }
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
