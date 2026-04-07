import type { ResourceScopeEntry } from '@/cedarling'

export const SHARED_CEDAR_CONSTANTS = {
  ADMIN_UI_RESOURCES: {
    Assets: 'Assets',
    Webhooks: 'Webhooks',
    Lock: 'Lock',
    Users: 'Users',
    Attributes: 'Attributes',
  },
  CEDAR_RESOURCE_SCOPES: {
    Assets: [] as ResourceScopeEntry[],
    Webhooks: [] as ResourceScopeEntry[],
    Lock: [] as ResourceScopeEntry[],
    Users: [] as ResourceScopeEntry[],
    Attributes: [] as ResourceScopeEntry[],
  },
} as const
