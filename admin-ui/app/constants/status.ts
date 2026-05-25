import { JANS_SERVICES } from './jansServices'

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

export const STATUS_DETAILS = [
  { label: 'menus.oauthserver', key: JANS_SERVICES.AUTH },
  { label: 'dashboard.config_api', key: JANS_SERVICES.CONFIG_API },
  { label: 'menus.fido', key: JANS_SERVICES.FIDO2 },
  { label: 'dashboard.casa', key: JANS_SERVICES.CASA },
  { label: 'dashboard.key_cloak', key: JANS_SERVICES.KEYCLOAK },
  { label: 'menus.scim', key: JANS_SERVICES.SCIM },
  { label: 'dashboard.jans_lock', key: JANS_SERVICES.LOCK },
] as const
