import customColors from '@/customColors'

export { BORDER_RADIUS, STATUS_DETAILS } from '@/constants'

export const USER_INFO_CHART_BREAKPOINT = 1370

export const CHART_CONSTANTS = {
  MIN_MAX: 1200,
  TICK_INTERVAL: 300,
  DOT_RADIUS: 3.5,
  ACTIVE_DOT_RADIUS: 5,
  FILL_OPACITY: 0.6,
  MARGIN: { top: 10, right: 30, left: -20, bottom: 20 },
} as const

export const CHART_LEGEND_CONFIG = [
  {
    dataKey: 'authz_code_idtoken_count',
    color: customColors.chartPurple,
    translationKey: 'tooltips.authz_code_idtoken_count',
  },
  {
    dataKey: 'authz_code_access_token_count',
    color: customColors.chartCoral,
    translationKey: 'tooltips.authz_code_access_token_count',
  },
  {
    dataKey: 'client_credentials_access_token_count',
    color: customColors.chartCyan,
    translationKey: 'tooltips.client_credentials_access_token_count',
  },
] as const
