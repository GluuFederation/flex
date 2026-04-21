import customColors from '@/customColors'

export const UNKNOWN_STATUS = 'unknown' as const

export type ServiceStatusValue = 'up' | 'down' | typeof UNKNOWN_STATUS | 'degraded'

export const STATUS_MAP = {
  'running': 'up',
  'up': 'up',
  'down': 'down',
  'degraded': 'degraded',
  'not present': UNKNOWN_STATUS,
  [UNKNOWN_STATUS]: UNKNOWN_STATUS,
} as const satisfies Record<string, ServiceStatusValue>

export const DEFAULT_STATUS: ServiceStatusValue = UNKNOWN_STATUS

export const STATUS_LABEL_KEYS: Record<ServiceStatusValue, string> = {
  up: 'messages.status_active',
  down: 'messages.status_inactive',
  degraded: 'messages.status_degraded',
  [UNKNOWN_STATUS]: 'messages.status_inactive',
} as const

export const STATUS_COLORS: Record<ServiceStatusValue, string> = {
  up: customColors.statusActive,
  down: customColors.statusInactive,
  degraded: customColors.orange,
  [UNKNOWN_STATUS]: customColors.orange,
} as const

export const STATUS_BADGE_COLOR: Record<ServiceStatusValue, string> = {
  up: 'success',
  down: 'danger',
  degraded: 'warning',
  [UNKNOWN_STATUS]: 'warning',
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
