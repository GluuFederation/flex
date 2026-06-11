import { createContext, useReducer, useContext, useEffect, useRef, type ReactNode } from 'react'
import { DEFAULT_THEME, isValidTheme, type ThemeValue } from './constants'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'
import type { ThemeState, ThemeAction, ThemeContextType } from './types'

export type { ThemeContextType }

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const extractUserTheme = (currentInum?: string | null): ThemeValue => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  try {
    const userConfig = storage.getJSON<{ theme?: string | Record<string, string> }>(
      STORAGE_KEYS.USER_CONFIG,
    )
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
    logger('Failed to extract user theme, using default:', e instanceof Error ? e : String(e))
    return DEFAULT_THEME
  }
}

const getInitialTheme = (): ThemeValue => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  try {
    const savedTheme = storage.get(STORAGE_KEYS.INIT_THEME)
    if (savedTheme && isValidTheme(savedTheme)) {
      return savedTheme
    }

    const userTheme = extractUserTheme()
    if (userTheme !== DEFAULT_THEME) {
      storage.set(STORAGE_KEYS.INIT_THEME, userTheme)
      return userTheme
    }

    storage.set(STORAGE_KEYS.INIT_THEME, DEFAULT_THEME)
    return DEFAULT_THEME
  } catch (e) {
    logger('Failed to get initial theme, using default:', e instanceof Error ? e : String(e))
    try {
      storage.set(STORAGE_KEYS.INIT_THEME, DEFAULT_THEME)
    } catch (e) {
      logger('Failed to write default theme to localStorage:', e instanceof Error ? e : String(e))
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
      storage.set(STORAGE_KEYS.INIT_THEME, action.type)
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
    const userInfo = storage.getJSON<{ inum?: string }>(STORAGE_KEYS.USER_INFO)
    return userInfo?.inum || null
  } catch (e) {
    logger('Failed to parse userInfo from localStorage:', e instanceof Error ? e : String(e))
  }
  return null
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const [state, dispatch] = useReducer(themeReducer, initialState)
  const hasSyncedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || hasSyncedRef.current) return

    try {
      const savedTheme = storage.get(STORAGE_KEYS.INIT_THEME)
      if (savedTheme && isValidTheme(savedTheme)) {
        dispatch({ type: savedTheme })
        hasSyncedRef.current = true
        return
      }

      const currentInum = getUserInum()
      const userTheme = extractUserTheme(currentInum)

      if (userTheme !== DEFAULT_THEME) {
        storage.set(STORAGE_KEYS.INIT_THEME, userTheme)
        dispatch({ type: userTheme })
      } else {
        storage.set(STORAGE_KEYS.INIT_THEME, DEFAULT_THEME)
        dispatch({ type: DEFAULT_THEME })
      }

      hasSyncedRef.current = true
    } catch (e) {
      logger(
        'Failed to sync theme in useEffect, ensuring default:',
        e instanceof Error ? e : String(e),
      )
      try {
        const currentTheme = storage.get(STORAGE_KEYS.INIT_THEME)
        if (!currentTheme || !isValidTheme(currentTheme)) {
          storage.set(STORAGE_KEYS.INIT_THEME, DEFAULT_THEME)
          dispatch({ type: DEFAULT_THEME })
        } else {
          dispatch({ type: currentTheme })
        }
        hasSyncedRef.current = true
      } catch (error) {
        logger(error instanceof Error ? error : String(error))
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
