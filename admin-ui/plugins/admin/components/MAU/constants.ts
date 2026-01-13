import type { DateRangePreset } from './types'
import customColors from '@/customColors'

export const MAU_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
} as const

export const DEFAULT_DATE_RANGE_MONTHS = 3

export const DATE_PRESETS: DateRangePreset[] = [
  { labelKey: 'fields.date_preset_3m', months: 3 },
  { labelKey: 'fields.date_preset_6m', months: 6 },
  { labelKey: 'fields.date_preset_1y', months: 12 },
] as const

export const CHART_COLORS_BY_THEME = {
  light: {
    mau: customColors.logo,
    pieClientCredentials: customColors.mauPieClientCredentials,
    pieAuthCodeAccess: customColors.mauPieAuthCodeAccess,
    trendClientCredentials: customColors.mauTrendClientCredentials,
    trendAuthCodeAccess: customColors.mauTrendAuthCodeAccess,
    trendAuthCodeId: customColors.mauTrendAuthCodeId,
  },
  dark: {
    mau: customColors.mauDark,
    pieClientCredentials: customColors.mauPieClientCredentials,
    pieAuthCodeAccess: customColors.mauPieAuthCodeAccess,
    trendClientCredentials: customColors.mauTrendClientCredentials,
    trendAuthCodeAccess: customColors.mauTrendAuthCodeAccess,
    trendAuthCodeId: customColors.mauTrendAuthCodeId,
  },
} as const

export type ThemeKey = keyof typeof CHART_COLORS_BY_THEME

export const getChartColors = (theme: ThemeKey | string) => {
  return CHART_COLORS_BY_THEME[theme as ThemeKey] ?? CHART_COLORS_BY_THEME.light
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
