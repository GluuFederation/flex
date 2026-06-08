import { createContext, useReducer, useContext, useEffect, useRef, type ReactNode } from 'react'
import { DEFAULT_THEME, isValidTheme, type ThemeValue } from './constants'
import { logger } from '@/utils/logger'
import { STORAGE_KEYS } from '@/constants'
import type { ThemeState, ThemeAction, ThemeContextType } from './types'

export type { ThemeContextType }

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const extractUserTheme = (currentInum?: string | null): ThemeValue => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  try {
    const userConfigStr = window.localStorage.getItem(STORAGE_KEYS.USER_CONFIG)
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
    logger.error('dev', 
      'Failed to extract user theme, using default:',
      e instanceof Error ? e : String(e),
    )
    return DEFAULT_THEME
  }
}

const getInitialTheme = (): ThemeValue => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  try {
    const savedTheme = window.localStorage.getItem(STORAGE_KEYS.INIT_THEME)
    if (savedTheme && isValidTheme(savedTheme)) {
      return savedTheme
    }

    const userTheme = extractUserTheme()
    if (userTheme !== DEFAULT_THEME) {
      window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, userTheme)
      return userTheme
    }

    window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, DEFAULT_THEME)
    return DEFAULT_THEME
  } catch (e) {
    logger.error('dev', 
      'Failed to get initial theme, using default:',
      e instanceof Error ? e : String(e),
    )
    try {
      window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, DEFAULT_THEME)
    } catch (e) {
      logger.warn('dev', 
        'Failed to write default theme to localStorage:',
        e instanceof Error ? e : String(e),
      )
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
      window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, action.type)
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
    const userInfoStr = window.localStorage.getItem(STORAGE_KEYS.USER_INFO)
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr) as { inum?: string }
      return userInfo?.inum || null
    }
  } catch (e) {
    logger.warn('dev', 
      'Failed to parse userInfo from localStorage:',
      e instanceof Error ? e : String(e),
    )
  }
  return null
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const [state, dispatch] = useReducer(themeReducer, initialState)
  const hasSyncedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || hasSyncedRef.current) return

    try {
      const savedTheme = window.localStorage.getItem(STORAGE_KEYS.INIT_THEME)
      if (savedTheme && isValidTheme(savedTheme)) {
        dispatch({ type: savedTheme })
        hasSyncedRef.current = true
        return
      }

      const currentInum = getUserInum()
      const userTheme = extractUserTheme(currentInum)

      if (userTheme !== DEFAULT_THEME) {
        window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, userTheme)
        dispatch({ type: userTheme })
      } else {
        window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, DEFAULT_THEME)
        dispatch({ type: DEFAULT_THEME })
      }

      hasSyncedRef.current = true
    } catch (e) {
      logger.error('dev', 
        'Failed to sync theme in useEffect, ensuring default:',
        e instanceof Error ? e : String(e),
      )
      try {
        const currentTheme = window.localStorage.getItem(STORAGE_KEYS.INIT_THEME)
        if (!currentTheme || !isValidTheme(currentTheme)) {
          window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, DEFAULT_THEME)
          dispatch({ type: DEFAULT_THEME })
        } else {
          dispatch({ type: currentTheme })
        }
        hasSyncedRef.current = true
      } catch (error) {
        logger.error('dev', error instanceof Error ? error : String(error))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.remove('theme-dark', 'theme-light')
    document.documentElement.classList.add(`theme-${state.theme}`)
  }, [state.theme])

  return <ThemeContext.Provider value={{ state, dispatch }}>{props.children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
