import { AdminUiFeatureResource, ApiPermissionType, CedarAction } from '@/cedarling'

export const ADMIN_UI_RESOURCES = {
  Dashboard: 'Dashboard',
  License: 'License',
  Health: 'Health',
  MAU: 'MAU',
  Security: 'Security',
  Settings: 'Settings',
  Webhooks: 'Webhooks',
  Assests: 'Assests',
  AuditLogs: 'AuditLogs',
  Clients: 'Clients',
  Scopes: 'Scopes',
  Keys: 'Keys',
  AuthenticationServerConfiguration: 'AuthenticationServerConfiguration',
  Logging: 'Logging',
  SSA: 'SSA',
  Authentication: 'Authentication',
  ConfigApiConfiguration: 'ConfigApiConfiguration',
  Sesison: 'Sesison',
  Users: 'Users',
  Scripts: 'Scripts',
  UserClaims: 'UserClaims',
  Cache: 'Cache',
  Persistance: 'Persistance',
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
