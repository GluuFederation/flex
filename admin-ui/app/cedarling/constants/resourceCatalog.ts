export const CEDAR_ACTIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
} as const

export const CEDARLING_BYPASS = 'CEDARLING_BYPASS' as const

export const RESOURCE_ACTIONS = {
  Dashboard: ['read'],
  License: ['read', 'write'],
  MAU: ['read'],
  Security: ['read', 'write'],
  Settings: ['read', 'write'],
  Webhooks: ['read', 'write', 'delete'],
  Assets: ['read', 'write', 'delete'],
  AuditLogs: ['read'],
  Clients: ['read', 'write', 'delete'],
  Scopes: ['read', 'write', 'delete'],
  Keys: ['read', 'write'],
  AuthenticationServerConfiguration: ['read', 'write'],
  Logging: ['read', 'write'],
  SSA: ['read', 'write', 'delete'],
  Authentication: ['read', 'write', 'delete'],
  ConfigApiConfiguration: ['read', 'write'],
  Session: ['read', 'delete'],
  Users: ['read', 'write', 'delete'],
  Scripts: ['read', 'write', 'delete'],
  Attributes: ['read', 'write', 'delete'],
  Cache: ['read', 'write', 'delete'],
  Persistence: ['read'],
  SMTP: ['read', 'write', 'delete'],
  SCIM: ['read', 'write'],
  FIDO: ['read', 'write', 'delete'],
  SAML: ['read', 'write', 'delete'],
  Lock: ['read', 'write'],
} as const satisfies Record<string, readonly (typeof CEDAR_ACTIONS)[keyof typeof CEDAR_ACTIONS][]>
