import customColors from '@/customColors'
import { OPACITY } from '@/constants'

export const RECHARTS_INITIAL_DIMENSION = { width: 100, height: 100 }

export const CHART_CONSTANTS = {
  MIN_MAX: 1200,
  TICK_INTERVAL: 300,
  DOT_RADIUS: 3.5,
  ACTIVE_DOT_RADIUS: 5,
  FILL_OPACITY: OPACITY.PLACEHOLDER,
  MARGIN: { top: 10, right: 30, left: -20, bottom: 20 },
} as const

export const chartGlobalStyles = {
  '.recharts-legend-wrapper': {
    display: 'none',
  },
  'table > thead > tr > th .Mui-active': {
    color: `var(--theme-text-color, ${customColors.primaryDark})`,
  },
  'table > thead > tr > th .Mui-active > svg': {
    color: `var(--theme-text-color, ${customColors.primaryDark})`,
  },
}
