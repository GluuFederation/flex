import { useNavigate, NavigateOptions } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

const ROUTES = {
  // Home & Dashboard (unified with plugin dashboard & sidebar)
  HOME_DASHBOARD: '/adm/dashboard',

  // User Management
  USER_MANAGEMENT: '/user/usersmanagement',
  USER_ADD: '/user/usermanagement/add',
  USER_EDIT: (id: string) => `/user/usermanagement/edit/${encodeURIComponent(id)}`,

  // Admin Console - Assets
  ASSETS_LIST: '/adm/assets',
  ASSET_ADD: '/adm/asset/add',
  ASSET_EDIT: (inum: string) => `/adm/asset/edit/${encodeURIComponent(inum)}`,

  // Admin Console - Webhooks
  WEBHOOK_LIST: '/adm/webhook',
  WEBHOOK_ADD: '/adm/webhook/add',
  WEBHOOK_EDIT: (inum: string) => `/adm/webhook/edit/${encodeURIComponent(inum)}`,

  // Admin Console - Custom Scripts
  CUSTOM_SCRIPT_LIST: '/adm/scripts',
  CUSTOM_SCRIPT_ADD: '/adm/script/new',
  CUSTOM_SCRIPT_EDIT: (inum: string) => `/adm/script/edit/${encodeURIComponent(inum)}`,

  // Schema / User Claims
  ATTRIBUTES_LIST: '/attributes',
  ATTRIBUTE_ADD: '/attribute/new',
  ATTRIBUTE_EDIT: (inum: string) => `/attribute/edit/${encodeURIComponent(inum)}`,
  ATTRIBUTE_VIEW: (inum: string) => `/attribute/view/${encodeURIComponent(inum)}`,

  // Auth Server - SSA
  AUTH_SERVER_SSA_LIST: '/auth-server/config/ssa',
  AUTH_SERVER_SSA_ADD: '/auth-server/config/ssa/new',

  // Auth Server - Scopes
  AUTH_SERVER_SCOPES_LIST: '/auth-server/scopes',
  AUTH_SERVER_SCOPE_ADD: '/auth-server/scope/new',
  AUTH_SERVER_SCOPE_EDIT: (inum: string) => `/auth-server/scope/edit/${encodeURIComponent(inum)}`,

  // Service Configuration
  SQL_LIST: '/config/sql',
  SQL_ADD: '/config/sql/new',
  SQL_EDIT: (configId: string) => `/config/sql/edit/${encodeURIComponent(configId)}`,
  LDAP_LIST: '/config/ldap',
  LDAP_ADD: '/config/ldap/new',
  LDAP_EDIT: (configId: string) => `/config/ldap/edit/${encodeURIComponent(configId)}`,

  // SAML
  SAML_SP_LIST: '/saml/service-providers',
  SAML_SP_ADD: '/saml/service-providers/add',
  SAML_SP_EDIT: '/saml/service-providers/edit',
  SAML_IDP_LIST: '/saml/identity-providers',
  SAML_IDP_ADD: '/saml/identity-providers/add',
  SAML_IDP_EDIT: '/saml/identity-providers/edit',

  // Layout routes
  LAYOUT_NAVBAR: '/layouts/navbar',
  LAYOUT_SIDEBAR: '/layouts/sidebar',
  LAYOUT_SIDEBAR_A: '/layouts/sidebar-a',
  LAYOUT_SIDEBAR_WITH_NAVBAR: '/layouts/sidebar-with-navbar',

  // Core app pages
  PROFILE: '/profile',
  LOGOUT: '/logout',
  ERROR_404: '/error-404',

  // Wildcard routes
  WILDCARD: '/*',
  ROOT: '/',
} as const

export const useAppNavigation = () => {
  const navigate = useNavigate()

  const navigateToRoute = useCallback(
    (route: string, options?: NavigateOptions): void => {
      navigate(route, options)
    },
    [navigate],
  )

  const navigateBack = useCallback(
    (fallbackRoute?: string): void => {
      if (window.history.length > 1) {
        navigate(-1)
      } else if (fallbackRoute) {
        navigateToRoute(fallbackRoute)
      }
    },
    [navigate, navigateToRoute],
  )

  return useMemo(
    () => ({
      navigateToRoute,
      navigateBack,
      navigate,
    }),
    [navigateToRoute, navigateBack, navigate],
  )
}

export { ROUTES }
