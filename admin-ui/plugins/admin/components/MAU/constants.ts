import type { DateRangePreset } from './types'

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
  darkBlack: {
    mau: '#4CAF50',
    clientCredentials: '#64B5F6',
    authCodeAccess: '#FFB74D',
    authCodeId: '#BA68C8',
  },
  darkBlue: {
    mau: '#00b875',
    clientCredentials: '#4FC3F7',
    authCodeAccess: '#FFB74D',
    authCodeId: '#CE93D8',
  },
  lightBlue: {
    mau: '#00b875',
    clientCredentials: '#1976D2',
    authCodeAccess: '#F57C00',
    authCodeId: '#7B1FA2',
  },
  lightGreen: {
    mau: '#2E7D32',
    clientCredentials: '#1565C0',
    authCodeAccess: '#E65100',
    authCodeId: '#6A1B9A',
  },
} as const

export type ThemeKey = keyof typeof CHART_COLORS_BY_THEME

export const getChartColors = (theme: string) => {
  return CHART_COLORS_BY_THEME[theme as ThemeKey] || CHART_COLORS_BY_THEME.lightGreen
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
