import { AdminUiFeatureResource, ApiPermissionType, CedarAction } from '@/cedarling'

export const CEDARLING_BYPASS = 'CEDARLING_BYPASS' as const

export const ADMIN_UI_RESOURCES = {
  Dashboard: 'Dashboard',
  License: 'License',
  MAU: 'MAU',
  Security: 'Security',
  Settings: 'Settings',
  Webhooks: 'Webhooks',
  Assets: 'Assets',
  AuditLogs: 'AuditLogs',
  Clients: 'Clients',
  Scopes: 'Scopes',
  Keys: 'Keys',
  AuthenticationServerConfiguration: 'AuthenticationServerConfiguration',
  Logging: 'Logging',
  SSA: 'SSA',
  Authentication: 'Authentication',
  ConfigApiConfiguration: 'ConfigApiConfiguration',
  Session: 'Session',
  Users: 'Users',
  Scripts: 'Scripts',
  Attributes: 'Attributes',
  Cache: 'Cache',
  Persistence: 'Persistence',
  SMTP: 'SMTP',
  SCIM: 'SCIM',
  FIDO: 'FIDO',
  SAML: 'SAML',
  Lock: 'Lock',
} as const satisfies Record<AdminUiFeatureResource, AdminUiFeatureResource>

export const findPermissionByUrl = (apiPermissions: ApiPermissionType[], url: string) => {
  return apiPermissions.find((perm) => perm.permission === url)
}

export const buildCedarPermissionKey = (resourceId: string, action: CedarAction) => {
  return `${resourceId}::${action}` as const
}
