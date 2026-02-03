import customColors from '@/customColors'

export type ServiceStatusValue = 'up' | 'down' | 'unknown' | 'degraded'

export const STATUS_MAP = {
  'Running': 'up',
  'UP': 'up',
  'up': 'up',
  'DOWN': 'down',
  'down': 'down',
  'DEGRADED': 'degraded',
  'degraded': 'degraded',
  'Not present': 'unknown',
  'not present': 'unknown',
  'unknown': 'unknown',
} as const satisfies Record<string, ServiceStatusValue>

export const DEFAULT_STATUS: ServiceStatusValue = 'unknown'

export const STATUS_LABEL_KEYS: Record<ServiceStatusValue, string> = {
  up: 'messages.status_active',
  down: 'messages.status_inactive',
  degraded: 'messages.status_degraded',
  unknown: 'messages.status_inactive',
} as const

export const STATUS_COLORS: Record<ServiceStatusValue, string> = {
  up: customColors.statusActive,
  down: customColors.statusInactive,
  degraded: customColors.orange,
  unknown: customColors.orange,
}

export const STATUS_BADGE_COLOR: Record<ServiceStatusValue, string> = {
  up: 'success',
  down: 'danger',
  degraded: 'warning',
  unknown: 'warning',
} as const

export const STATUS_DETAILS = [
  { label: 'menus.oauthserver', key: 'jans-auth' },
  { label: 'dashboard.config_api', key: 'jans-config-api' },
  { label: 'menus.fido', key: 'jans-fido2' },
  { label: 'dashboard.casa', key: 'jans-casa' },
  { label: 'dashboard.key_cloak', key: 'keycloak' },
  { label: 'menus.scim', key: 'jans-scim' },
  { label: 'dashboard.jans_lock', key: 'jans-lock' },
] as const
