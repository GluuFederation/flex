import customColors from '@/customColors'

export const DASHBOARD_CACHE_CONFIG = {
  STALE_TIME: 30 * 1000,
  GC_TIME: 60 * 1000,
} as const

export const REPORTS_CACHE_CONFIG = {
  STALE_TIME: 60 * 1000,
  GC_TIME: 2 * 60 * 1000,
} as const

export const STATUS_DISPLAY_MAP: Record<string, string> = {
  'up': 'Running',
  'down': 'Down',
  'degraded': 'Degraded',
  'unknown': 'Unknown',
  'running': 'Running',
  'online': 'Online',
  'not present': 'Unknown',
} as const

export const STATUS_COLOR_MAP: Record<string, string> = {
  'up': 'success',
  'down': 'danger',
  'degraded': 'warning',
  'unknown': 'secondary',
  'running': 'success',
  'online': 'success',
  'not present': 'secondary',
} as const

export const getStatusDisplay = (status: string): string => {
  return STATUS_DISPLAY_MAP[status.toLowerCase()] ?? 'Unknown'
}

export const getStatusColor = (status: string): string => {
  return STATUS_COLOR_MAP[status.toLowerCase()] ?? 'secondary'
}

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

export const STATUS_DETAILS = [
  { label: 'menus.oauthserver', key: 'jans-auth' },
  { label: 'dashboard.config_api', key: 'jans-config-api' },
  { label: 'FIDO', key: 'jans-fido2' },
  { label: 'CASA', key: 'jans-casa' },
  { label: 'dashboard.key_cloak', key: 'keycloak' },
  { label: 'SCIM', key: 'jans-scim' },
  { label: 'dashboard.jans_lock', key: 'jans-lock' },
] as const

export const BORDER_RADIUS = {
  DEFAULT: 16,
  LARGE: 24,
  MEDIUM: 14,
  SMALL: 5,
  CIRCLE: '50%',
  THIN: '1.5px',
} as const
