import { useCallback } from 'react'
import { useTheme } from '@/context/theme/themeContext'
import { isValidTheme, type ThemeValue } from '@/context/theme/constants'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'
import type { UserInfo } from 'Redux/features/types/authTypes'

type UserConfig = {
  lang?: Record<string, string>
  theme?: Record<string, string>
}

/**
 * Applies a theme change and, when the user is identified, persists it to
 * `USER_CONFIG` keyed by `inum`. Anonymous users get the dispatch without a write.
 */
export const useThemePersistence = (userInfo: UserInfo | null | undefined) => {
  const { dispatch } = useTheme()
  const inum = userInfo?.inum

  return useCallback(
    (value: string) => {
      if (!isValidTheme(value)) {
        logger.warn('Invalid theme value:', value)
        return
      }

      const themeValue: ThemeValue = value

      if (inum) {
        // storage.getJSON already logs and returns null on a parse failure.
        const existingConfig = storage.getJSON<UserConfig>(STORAGE_KEYS.USER_CONFIG) ?? {}
        storage.setJSON(STORAGE_KEYS.USER_CONFIG, {
          ...existingConfig,
          lang: existingConfig.lang || {},
          theme: { ...(existingConfig.theme || {}), [inum]: themeValue },
        })
      }

      dispatch({ type: themeValue })
    },
    [inum, dispatch],
  )
}
