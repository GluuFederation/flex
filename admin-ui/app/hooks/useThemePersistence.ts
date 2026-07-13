import { useCallback } from 'react'
import { useTheme } from '@/context/theme/themeContext'
import { isValidTheme, type ThemeValue } from '@/context/theme/constants'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'
import { safeParseUserConfig } from '@/utils/userConfig'
import type { UserInfo } from 'Redux/features/types/authTypes'

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
        const existingConfig = safeParseUserConfig()
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
