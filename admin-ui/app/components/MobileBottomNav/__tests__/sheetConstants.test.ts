jest.mock('@/helpers/navigation', () => ({
  ROUTES: {
    CUSTOM_SCRIPT_LIST: '/home/scripts',
    ATTRIBUTES_LIST: '/attributes',
    SERVICES_CACHE: '/config/cache',
    SERVICES_PERSISTENCE: '/config/persistence',
    SMTP_BASE: '/smtp/smtpmanagement',
    SCIM_BASE: '/scim',
    FIDO_BASE: '/fido/configuration',
    FIDO_METRICS: '/fido/metrics',
    FIDO_SECURITY_MONITOR: '/fido/security-monitor',
    JANS_LOCK_BASE: '/jans-lock',
    ADMIN_DASHBOARD: '/home/dashboard',
    ADMIN_HEALTH: '/home/health',
    ADMIN_LICENSE_DETAILS: '/home/license',
    ADMIN_MAU_GRAPH: '/home/mau',
    ADMIN_SETTINGS: '/home/settings',
    ADMIN_MAPPING: '/home/mapping',
    ADMIN_CEDARLING_CONFIG: '/home/cedarlingconfig',
    WEBHOOK_LIST: '/home/webhooks',
    ASSETS_LIST: '/home/assets',
    ADMIN_AUDIT_LOGS: '/home/auditlogs',
    AUTH_SERVER_CLIENTS_LIST: '/auth-server/clients',
    AUTH_SERVER_SCOPES_LIST: '/auth-server/scopes',
    AUTH_SERVER_CONFIG_KEYS: '/auth-server/keys',
    AUTH_SERVER_CONFIG_PROPERTIES: '/auth-server/properties',
    AUTH_SERVER_CONFIG_LOGGING: '/auth-server/logging',
    AUTH_SERVER_SSA_LIST: '/auth-server/ssa',
    AUTH_SERVER_AUTHN: '/auth-server/authn',
    AUTH_SERVER_CONFIG_API: '/auth-server/config-api',
    AUTH_SERVER_SESSIONS: '/auth-server/sessions',
    USER_MANAGEMENT: '/user/usersmanagement',
  },
}))

import { isMoreMenuPath, MORE_TILE_DEFS, SHEET } from '../sheetConstants'

describe('isMoreMenuPath', () => {
  it('is true for an exact More-tile route', () => {
    expect(isMoreMenuPath('/home/scripts')).toBe(true)
    expect(isMoreMenuPath('/scim')).toBe(true)
  })

  it('is true for a nested sub-route of a More-tile route', () => {
    expect(isMoreMenuPath('/home/scripts/edit/1')).toBe(true)
  })

  it('is true for a route belonging to a tile child (FIDO/Services)', () => {
    expect(isMoreMenuPath('/fido/metrics')).toBe(true)
    expect(isMoreMenuPath('/config/persistence')).toBe(true)
  })

  it('is false for a route not owned by any More-tile', () => {
    expect(isMoreMenuPath('/auth-server/clients')).toBe(false)
    expect(isMoreMenuPath('/home/dashboard')).toBe(false)
  })

  it('does not match a prefix that is not a path boundary', () => {
    expect(isMoreMenuPath('/scimmer')).toBe(false)
  })
})

describe('MORE_TILE_DEFS', () => {
  it('exposes the fixed 8 All Category tiles', () => {
    expect(MORE_TILE_DEFS).toHaveLength(8)
  })

  it('leaves the design-only Notification tile without a route or children', () => {
    const notification = MORE_TILE_DEFS.find((tile) => tile.key === 'notification')
    expect(notification?.path).toBeUndefined()
    expect(notification?.children).toBeUndefined()
  })

  it('gives drill-in tiles (FIDO, Services) children with routes', () => {
    const fido = MORE_TILE_DEFS.find((tile) => tile.key === 'fido')
    expect(fido?.children?.every((child) => !!child.path)).toBe(true)
  })
})

describe('SHEET tokens', () => {
  it('layers the sheet stack above the app block-ui ceiling', () => {
    expect(SHEET.Z_SCRIM).toBeGreaterThan(10000)
    expect(SHEET.Z_SHEET).toBeGreaterThan(SHEET.Z_SCRIM)
    expect(SHEET.Z_BAR_ELEVATED).toBeGreaterThan(SHEET.Z_SHEET)
  })
})
