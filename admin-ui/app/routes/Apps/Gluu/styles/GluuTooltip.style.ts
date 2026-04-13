import type { CSSProperties } from 'react'
import getThemeColor from '@/context/theme/config'
import { THEME_LIGHT } from '@/context/theme/constants'

export const DEFAULT_Z_INDEX = 101
export const TOOLTIP_MAX_WIDTH = '45vw'

export const getLabelTooltipStyle = (
  isDarkTheme: boolean,
  zIndex: number = DEFAULT_Z_INDEX,
): CSSProperties => {
  const lightTheme = getThemeColor(THEME_LIGHT)
  const colors = isDarkTheme
    ? { backgroundColor: lightTheme.menu.background, color: lightTheme.fontColor }
    : { backgroundColor: lightTheme.fontColor, color: lightTheme.card.background }
  return {
    zIndex,
    maxWidth: TOOLTIP_MAX_WIDTH,
    ...colors,
  }
}
