import customColors from '@/customColors'

export { BORDER_RADIUS, STATUS_DETAILS } from '@/constants'

export const USER_INFO_CHART_BREAKPOINT = 1370

export const DATE_RANGE_TYPE = {
  START: 'start',
  END: 'end',
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
