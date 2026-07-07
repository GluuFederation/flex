import { ROUTES } from '@/helpers/navigation'
import { MOBILE_BOTTOM_NAV_HEIGHT } from '@/constants/ui'

export const MOBILE_MEDIA_QUERY = '(max-width:767px)'

export const PRIMARY_TAB_DEFS = [
  {
    key: 'home',
    titleKey: 'menus.home',
    iconKey: 'home',
    path: ROUTES.HOME_DASHBOARD,
    basePath: ROUTES.PLUGIN_BASE_PATHS.HOME,
  },
  {
    key: 'auth-server',
    titleKey: 'menus.oauthserver',
    iconKey: 'oauthserver',
    path: ROUTES.AUTH_SERVER_CLIENTS_LIST,
    basePath: ROUTES.PLUGIN_BASE_PATHS.AUTH_SERVER,
  },
  {
    key: 'users',
    titleKey: 'menus.users',
    iconKey: 'usersmanagement',
    path: ROUTES.USER_MANAGEMENT,
    basePath: ROUTES.PLUGIN_BASE_PATHS.USER_MANAGEMENT,
    directNav: true,
  },
] as const

export const MORE_TAB_KEY = 'more'

export const BOTTOM_NAV = {
  HEIGHT: MOBILE_BOTTOM_NAV_HEIGHT,
  ICON_SIZE: 26,
  TAB_GAP: 4,
  TAB_MIN_HEIGHT: 44,
  ACTIVE_INDICATOR_HEIGHT: 3,
  ACTIVE_INDICATOR_WIDTH: 28,
  PADDING_X: 27,
  Z_ROOT: 1200,
  SHADOW_OFFSET_Y: -6,
  SHADOW_BLUR: 20,
  SHADOW_OPACITY: 0.08,
} as const
