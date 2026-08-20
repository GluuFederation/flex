import { ROUTES } from '@/helpers/navigation'

export const SHEET_KEYS = {
  HOME: 'home',
  AUTH_SERVER: 'auth-server',
  USERS: 'users',
  MORE: 'more',
  /** Opens the sheet with caller-supplied content instead of a navigation menu. */
  CUSTOM: 'custom',
} as const

export type SheetKey = (typeof SHEET_KEYS)[keyof typeof SHEET_KEYS]

export type SectionKey = Exclude<SheetKey, typeof SHEET_KEYS.MORE | typeof SHEET_KEYS.CUSTOM>

export const isSectionKey = (key: SheetKey): key is SectionKey =>
  key !== SHEET_KEYS.MORE && key !== SHEET_KEYS.CUSTOM

export type SheetItem = {
  key: string
  titleKey: string
  path?: string
  iconKey?: string
  children?: readonly SheetItem[]
}

export const MORE_TILE_DEFS: readonly SheetItem[] = [
  {
    key: 'scripts',
    titleKey: 'menus.scripts',
    iconKey: 'scripts',
    path: ROUTES.CUSTOM_SCRIPT_LIST,
  },
  {
    key: 'user-claims',
    titleKey: 'menus.user_claims',
    iconKey: 'user_claims',
    path: ROUTES.ATTRIBUTES_LIST,
  },
  {
    key: 'services',
    titleKey: 'menus.services',
    iconKey: 'services',
    children: [
      { key: 'services-cache', titleKey: 'menus.cache', path: ROUTES.SERVICES_CACHE },
      {
        key: 'services-persistence',
        titleKey: 'menus.persistence',
        path: ROUTES.SERVICES_PERSISTENCE,
      },
    ],
  },
  { key: 'smtp', titleKey: 'menus.smtp', iconKey: 'smtpmanagement', path: ROUTES.SMTP_BASE },
  { key: 'scim', titleKey: 'menus.scim', iconKey: 'scim', path: ROUTES.SCIM_BASE },
  {
    key: 'fido',
    titleKey: 'menus.fido',
    iconKey: 'fidomanagement',
    children: [
      { key: 'fido-configuration', titleKey: 'menus.configuration', path: ROUTES.FIDO_BASE },
      { key: 'fido-metrics', titleKey: 'menus.metrics', path: ROUTES.FIDO_METRICS },
      {
        key: 'fido-security-monitor',
        titleKey: 'menus.security_monitor',
        path: ROUTES.FIDO_SECURITY_MONITOR,
      },
    ],
  },
  {
    key: 'jans-lock',
    titleKey: 'menus.jans_lock',
    iconKey: 'jans_lock',
    path: ROUTES.JANS_LOCK_BASE,
  },
  { key: 'notification', titleKey: 'menus.notification', iconKey: 'notification' },
] as const

const MORE_MENU_PATHS: readonly string[] = MORE_TILE_DEFS.flatMap((tile) => [
  ...(tile.path ? [tile.path] : []),
  ...(tile.children?.map((child) => child.path).filter((p): p is string => !!p) ?? []),
])

export const isMoreMenuPath = (pathname: string): boolean =>
  MORE_MENU_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))

export type SectionMenu = {
  key: SheetKey
  titleKey: string
  iconKey: string
  items: readonly SheetItem[]
}

export const SECTION_MENUS: Readonly<Record<SectionKey, SectionMenu>> = {
  'home': {
    key: SHEET_KEYS.HOME,
    titleKey: 'menus.home',
    iconKey: 'home',
    items: [
      { key: 'dashboard', titleKey: 'menus.dashboard', path: ROUTES.ADMIN_DASHBOARD },
      { key: 'health', titleKey: 'menus.health', path: ROUTES.ADMIN_HEALTH },
      { key: 'license', titleKey: 'menus.licenseDetails', path: ROUTES.ADMIN_LICENSE_DETAILS },
      { key: 'mau', titleKey: 'menus.maugraph', path: ROUTES.ADMIN_MAU_GRAPH },
      { key: 'settings', titleKey: 'menus.settings', path: ROUTES.ADMIN_SETTINGS },
      {
        key: 'security',
        titleKey: 'menus.security',
        children: [
          {
            key: 'security-mapping',
            titleKey: 'menus.securityDropdown.mapping',
            path: ROUTES.ADMIN_MAPPING,
          },
          {
            key: 'security-cedarling',
            titleKey: 'menus.securityDropdown.cedarlingConfig',
            path: ROUTES.ADMIN_CEDARLING_CONFIG,
          },
          {
            key: 'security-policy-stores',
            titleKey: 'menus.securityDropdown.policyStoreHistory',
            path: ROUTES.ADMIN_POLICY_STORES,
          },
        ],
      },
      { key: 'webhooks', titleKey: 'menus.webhooks', path: ROUTES.WEBHOOK_LIST },
      { key: 'assets', titleKey: 'menus.assets', path: ROUTES.ASSETS_LIST },
      { key: 'audit-logs', titleKey: 'menus.audit_logs', path: ROUTES.ADMIN_AUDIT_LOGS },
    ],
  },
  'auth-server': {
    key: SHEET_KEYS.AUTH_SERVER,
    titleKey: 'menus.oauthserver',
    iconKey: 'oauthserver',
    items: [
      { key: 'clients', titleKey: 'menus.clients', path: ROUTES.AUTH_SERVER_CLIENTS_LIST },
      { key: 'scopes', titleKey: 'menus.scopes', path: ROUTES.AUTH_SERVER_SCOPES_LIST },
      { key: 'keys', titleKey: 'menus.keys', path: ROUTES.AUTH_SERVER_CONFIG_KEYS },
      {
        key: 'properties',
        titleKey: 'menus.properties',
        path: ROUTES.AUTH_SERVER_CONFIG_PROPERTIES,
      },
      { key: 'logging', titleKey: 'menus.logging', path: ROUTES.AUTH_SERVER_CONFIG_LOGGING },
      { key: 'ssa', titleKey: 'menus.ssa', path: ROUTES.AUTH_SERVER_SSA_LIST },
      { key: 'authentication', titleKey: 'menus.authentication', path: ROUTES.AUTH_SERVER_AUTHN },
      { key: 'config-api', titleKey: 'menus.configuration', path: ROUTES.AUTH_SERVER_CONFIG_API },
      { key: 'sessions', titleKey: 'menus.sessions', path: ROUTES.AUTH_SERVER_SESSIONS },
    ],
  },
  'users': {
    key: SHEET_KEYS.USERS,
    titleKey: 'menus.users',
    iconKey: 'usersmanagement',
    items: [{ key: 'users-list', titleKey: 'menus.users', path: ROUTES.USER_MANAGEMENT }],
  },
}

export const SHEET = {
  TILE_CHIP_WIDTH: 40,
  TILE_CHIP_HEIGHT: 41,
  TILE_CHIP_RADIUS: 7,
  TILE_ICON_SIZE: 24,
  TILE_GAP: 8,
  GRID_COLUMNS: 4,
  GRID_ROW_GAP: 20,
  LIST_ROW_GAP: 20,
  LIST_ITEM_GAP: 12,
  LIST_PADDING_Y: 20,
  SUBLIST_INDENT: 16,
  GRID_PADDING_TOP: 20,
  GRID_PADDING_BOTTOM: 8,
  HEADER_GAP: 8,
  HEADER_PADDING_TOP: 20,
  HEADER_PADDING_BOTTOM: 16,
  HEADER_ICON_SIZE: 24,
  CLOSE_SIZE: 22,
  BACK_SIZE: 34,
  BACK_ICON_SIZE: 20,
  MAX_HEIGHT: '80vh',
  SHADOW_OFFSET_Y: -4,
  SHADOW_BLUR: 25,
  SHADOW_OPACITY: 0.1,
  SCRIM_OPACITY: 0.6,
  TRANSITION_MS: 800,
  SUBLIST_TRANSITION_MS: 500,
  Z_SCRIM: 10001,
  Z_SHEET: 10002,
  Z_BAR_ELEVATED: 10003,
} as const
