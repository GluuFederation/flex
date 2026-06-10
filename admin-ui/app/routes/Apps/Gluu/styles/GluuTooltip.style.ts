import type { CSSProperties } from 'react'
import { makeStyles } from 'tss-react/mui'
import getThemeColor from '@/context/theme/config'
import { THEME_LIGHT } from '@/context/theme/constants'
import { OPACITY, TOOLTIP } from '@/constants'

export const DEFAULT_Z_INDEX = 101
const TOOLTIP_MAX_WIDTH = '45vw'

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

const ARROW_OFFSET = -TOOLTIP.ARROW_SIZE / 2

export const TOOLTIP_ARROW_CLASS = 'gluu-tooltip-arrow'

export const useStyles = makeStyles()(() => ({
  popper: {
    [`& .${TOOLTIP_ARROW_CLASS}`]: {
      position: 'absolute',
      width: TOOLTIP.ARROW_SIZE,
      height: TOOLTIP.ARROW_SIZE,
    },
    [`&[data-popper-placement*="bottom"] .${TOOLTIP_ARROW_CLASS}`]: {
      top: ARROW_OFFSET,
      left: '50%',
      transform: 'translateX(-50%) rotate(45deg)',
    },
    [`&[data-popper-placement*="top"] .${TOOLTIP_ARROW_CLASS}`]: {
      bottom: ARROW_OFFSET,
      left: '50%',
      transform: 'translateX(-50%) rotate(45deg)',
    },
    [`&[data-popper-placement*="right"] .${TOOLTIP_ARROW_CLASS}`]: {
      left: ARROW_OFFSET,
      top: '50%',
      transform: 'translateY(-50%) rotate(45deg)',
    },
    [`&[data-popper-placement*="left"] .${TOOLTIP_ARROW_CLASS}`]: {
      right: ARROW_OFFSET,
      top: '50%',
      transform: 'translateY(-50%) rotate(45deg)',
    },
  },
  inner: {
    position: 'relative',
    opacity: OPACITY.OVERLAY,
  },
  tooltip: {
    position: 'relative',
    padding: `${TOOLTIP.PADDING_VERTICAL}px ${TOOLTIP.PADDING_HORIZONTAL}px`,
    borderRadius: TOOLTIP.BORDER_RADIUS,
    fontSize: TOOLTIP.FONT_SIZE,
    width: 'max-content',
  },
}))
