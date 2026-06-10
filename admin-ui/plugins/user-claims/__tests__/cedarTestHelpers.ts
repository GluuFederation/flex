import type { ResourceScopeEntry } from '@/cedarling'

export const ADMIN_UI_RESOURCES = {
  Attributes: 'Attributes',
  Webhooks: 'Webhooks',
  Lock: 'Lock',
} as const

export const CEDAR_RESOURCE_SCOPES = {
  Attributes: [] as ResourceScopeEntry[],
  Webhooks: [] as ResourceScopeEntry[],
  Lock: [] as ResourceScopeEntry[],
} as const
