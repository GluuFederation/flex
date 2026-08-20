import type { DateRangePreset } from './types'
import customColors from '@/customColors'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'

export const MAU_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
} as const

export const DEFAULT_DATE_RANGE_MONTHS = 3

export const CHART_MARGIN = { top: 10, right: 40, left: 0, bottom: 0 } as const

export const MOBILE_CHART_MARGIN = { top: 10, right: 40, left: 0, bottom: 0 } as const

export const DATE_PRESETS: DateRangePreset[] = [
  { labelKey: 'fields.date_preset_3m', value: 3 },
  { labelKey: 'fields.date_preset_6m', value: 6 },
  { labelKey: 'fields.date_preset_1y', value: 12 },
] as const

const sharedMauColors = {
  pieClientCredentials: customColors.mauPieClientCredentials,
  pieAuthCodeAccess: customColors.mauPieAuthCodeAccess,
  trendClientCredentials: customColors.mauTrendClientCredentials,
  trendAuthCodeAccess: customColors.mauTrendAuthCodeAccess,
  trendAuthCodeId: customColors.mauTrendAuthCodeId,
  totalTokens: customColors.textSecondary,
} as const

const CHART_COLORS_BY_THEME = {
  [THEME_LIGHT]: {
    mau: customColors.logo,
    ...sharedMauColors,
  },
  [THEME_DARK]: {
    mau: customColors.statusActive,
    ...sharedMauColors,
  },
} as const

export type ThemeKey = keyof typeof CHART_COLORS_BY_THEME

export const getChartColors = (theme: ThemeKey | string) => {
  return CHART_COLORS_BY_THEME[theme as ThemeKey] ?? CHART_COLORS_BY_THEME[THEME_LIGHT]
}

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const
