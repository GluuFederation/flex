import { useMemo } from 'react'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import type { SecurityTheme } from '../types'

const useSecurityTheme = (): SecurityTheme => {
  const { state } = useTheme()

  return useMemo(
    () => ({
      theme: state.theme,
      themeColors: getThemeColor(state.theme),
      isDark: state.theme === THEME_DARK,
    }),
    [state.theme],
  )
}

export { useSecurityTheme }
