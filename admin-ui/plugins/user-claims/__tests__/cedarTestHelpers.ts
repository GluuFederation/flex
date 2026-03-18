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

export const CEDAR_RESOURCE_SCOPES_WITH_PERMISSIONS = {
  Attributes: [
    { permission: 'read', resourceId: ADMIN_UI_RESOURCES.Attributes },
    { permission: 'write', resourceId: ADMIN_UI_RESOURCES.Attributes },
    { permission: 'delete', resourceId: ADMIN_UI_RESOURCES.Attributes },
  ] as ResourceScopeEntry[],
  Webhooks: [
    { permission: 'read', resourceId: ADMIN_UI_RESOURCES.Webhooks },
    { permission: 'write', resourceId: ADMIN_UI_RESOURCES.Webhooks },
    { permission: 'delete', resourceId: ADMIN_UI_RESOURCES.Webhooks },
  ] as ResourceScopeEntry[],
  Lock: [
    { permission: 'read', resourceId: ADMIN_UI_RESOURCES.Lock },
    { permission: 'write', resourceId: ADMIN_UI_RESOURCES.Lock },
  ] as ResourceScopeEntry[],
} as const
