import { useNavigate, NavigateOptions } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

// Plugin Base Paths - Single source of truth
const PLUGIN_BASE_PATHS = {
  SAML: '/saml',
  ADMIN: '/adm',
  USER_MANAGEMENT: '/user',
  AUTH_SERVER: '/auth-server',
  SERVICES: '/config',
  SCIM: '/scim',
  FIDO: '/fido',
  SMTP: '/smtp',
  JANS_LOCK: '/jans-lock',
  SCHEMA: '/attributes', // Schema uses /attributes as base
} as const

const ROUTES = {
  // ========== Plugin Base Paths ==========
  PLUGIN_BASE_PATHS,

  // ========== Home & Dashboard ==========
  HOME_DASHBOARD: `${PLUGIN_BASE_PATHS.ADMIN}/dashboard`,

  // ========== User Management Plugin ==========
  USER_MANAGEMENT: `${PLUGIN_BASE_PATHS.USER_MANAGEMENT}/usersmanagement`,
  USER_ADD: `${PLUGIN_BASE_PATHS.USER_MANAGEMENT}/usermanagement/add`,
  USER_EDIT: (id: string) =>
    `${PLUGIN_BASE_PATHS.USER_MANAGEMENT}/usermanagement/edit/${encodeURIComponent(id)}`,
  USER_EDIT_TEMPLATE: `${PLUGIN_BASE_PATHS.USER_MANAGEMENT}/usermanagement/edit/:id`,

  // ========== Admin Console Plugin ==========
  // Dashboard
  ADMIN_DASHBOARD: `${PLUGIN_BASE_PATHS.ADMIN}/dashboard`,
  ADMIN_HEALTH: `${PLUGIN_BASE_PATHS.ADMIN}/health`,
  ADMIN_LICENSE_DETAILS: `${PLUGIN_BASE_PATHS.ADMIN}/licenseDetails`,
  ADMIN_MAU_GRAPH: `${PLUGIN_BASE_PATHS.ADMIN}/maugraph`,
  ADMIN_SETTINGS: `${PLUGIN_BASE_PATHS.ADMIN}/settings`,
  ADMIN_MAPPING: `${PLUGIN_BASE_PATHS.ADMIN}/mapping`,
  ADMIN_CEDARLING_CONFIG: `${PLUGIN_BASE_PATHS.ADMIN}/cedarlingconfig`,
  ADMIN_AUDIT_LOGS: `${PLUGIN_BASE_PATHS.ADMIN}/audit-logs`,

  // Assets
  ASSETS_LIST: `${PLUGIN_BASE_PATHS.ADMIN}/assets`,
  ASSET_ADD: `${PLUGIN_BASE_PATHS.ADMIN}/asset/add`,
  ASSET_EDIT: (inum: string) => `${PLUGIN_BASE_PATHS.ADMIN}/asset/edit/${encodeURIComponent(inum)}`,
  ASSET_EDIT_TEMPLATE: `${PLUGIN_BASE_PATHS.ADMIN}/asset/edit/:id`,

  // Webhooks
  WEBHOOK_LIST: `${PLUGIN_BASE_PATHS.ADMIN}/webhook`,
  WEBHOOK_ADD: `${PLUGIN_BASE_PATHS.ADMIN}/webhook/add`,
  WEBHOOK_EDIT: (inum: string) =>
    `${PLUGIN_BASE_PATHS.ADMIN}/webhook/edit/${encodeURIComponent(inum)}`,
  WEBHOOK_EDIT_TEMPLATE: `${PLUGIN_BASE_PATHS.ADMIN}/webhook/edit/:id`,

  // Custom Scripts (shares admin base path)
  CUSTOM_SCRIPT_LIST: `${PLUGIN_BASE_PATHS.ADMIN}/scripts`,
  CUSTOM_SCRIPT_ADD: `${PLUGIN_BASE_PATHS.ADMIN}/script/new`,
  CUSTOM_SCRIPT_VIEW: (inum: string) =>
    `${PLUGIN_BASE_PATHS.ADMIN}/script/view/${encodeURIComponent(inum)}`,
  CUSTOM_SCRIPT_VIEW_TEMPLATE: `${PLUGIN_BASE_PATHS.ADMIN}/script/view/:id`,
  CUSTOM_SCRIPT_EDIT: (inum: string) =>
    `${PLUGIN_BASE_PATHS.ADMIN}/script/edit/${encodeURIComponent(inum)}`,
  CUSTOM_SCRIPT_EDIT_TEMPLATE: `${PLUGIN_BASE_PATHS.ADMIN}/script/edit/:id`,

  // ========== Schema / User Claims Plugin ==========
  ATTRIBUTES_LIST: `${PLUGIN_BASE_PATHS.SCHEMA}`,
  ATTRIBUTE_ADD: '/attribute/new',
  ATTRIBUTE_EDIT: (inum: string) => `/attribute/edit/${encodeURIComponent(inum)}`,
  ATTRIBUTE_EDIT_TEMPLATE: '/attribute/edit/:gid',
  ATTRIBUTE_VIEW: (inum: string) => `/attribute/view/${encodeURIComponent(inum)}`,
  ATTRIBUTE_VIEW_TEMPLATE: '/attribute/view/:gid',

  // ========== Auth Server Plugin ==========
  // Clients
  AUTH_SERVER_CLIENTS_LIST: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/clients`,
  AUTH_SERVER_CLIENTS_LIST_WITH_SCOPE: (scopeInum: string) =>
    `${PLUGIN_BASE_PATHS.AUTH_SERVER}/clients?scopeInum=${encodeURIComponent(scopeInum)}`,
  AUTH_SERVER_CLIENT_ADD: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/client/new`,
  AUTH_SERVER_CLIENT_EDIT: (inum: string) =>
    `${PLUGIN_BASE_PATHS.AUTH_SERVER}/client/edit/${encodeURIComponent(inum)}`,
  AUTH_SERVER_CLIENT_EDIT_TEMPLATE: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/client/edit/:id`,

  // Scopes
  AUTH_SERVER_SCOPES_LIST: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/scopes`,
  AUTH_SERVER_SCOPE_ADD: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/scope/new`,
  AUTH_SERVER_SCOPE_EDIT: (inum: string) =>
    `${PLUGIN_BASE_PATHS.AUTH_SERVER}/scope/edit/${encodeURIComponent(inum)}`,
  AUTH_SERVER_SCOPE_EDIT_TEMPLATE: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/scope/edit/:id`,

  // Configuration
  AUTH_SERVER_CONFIG_PROPERTIES: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/config/properties`,
  AUTH_SERVER_CONFIG_KEYS: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/config/keys`,
  AUTH_SERVER_CONFIG_LOGGING: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/config/logging`,
  AUTH_SERVER_CONFIG_API: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/config-api-configuration`,

  // SSA
  AUTH_SERVER_SSA_LIST: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/config/ssa`,
  AUTH_SERVER_SSA_ADD: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/config/ssa/new`,

  // Authentication
  AUTH_SERVER_AUTHN: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/authn`,
  AUTH_SERVER_AUTHN_EDIT: (id: string) =>
    `${PLUGIN_BASE_PATHS.AUTH_SERVER}/authn/edit/${encodeURIComponent(id)}`,
  AUTH_SERVER_AUTHN_EDIT_TEMPLATE: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/authn/edit/:id`,

  // Sessions
  AUTH_SERVER_SESSIONS: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/sessions`,

  // Agama
  AUTH_SERVER_AGAMA: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/agama`,

  // Lock
  AUTH_SERVER_LOCK: `${PLUGIN_BASE_PATHS.AUTH_SERVER}/lock`,

  // ========== Services Plugin ==========
  SERVICES_CACHE: `${PLUGIN_BASE_PATHS.SERVICES}/cache`,
  SERVICES_PERSISTENCE: `${PLUGIN_BASE_PATHS.SERVICES}/persistence`,

  // LDAP
  LDAP_LIST: `${PLUGIN_BASE_PATHS.SERVICES}/ldap`,
  LDAP_ADD: `${PLUGIN_BASE_PATHS.SERVICES}/ldap/new`,
  LDAP_EDIT: (configId: string) =>
    `${PLUGIN_BASE_PATHS.SERVICES}/ldap/edit/${encodeURIComponent(configId)}`,
  LDAP_EDIT_TEMPLATE: `${PLUGIN_BASE_PATHS.SERVICES}/ldap/edit/:configId`,

  // ========== SAML Plugin ==========
  SAML_BASE: PLUGIN_BASE_PATHS.SAML,
  SAML_CONFIG: `${PLUGIN_BASE_PATHS.SAML}/config`,
  SAML_IDP_LIST: `${PLUGIN_BASE_PATHS.SAML}/identity-providers`,
  SAML_IDP_ADD: `${PLUGIN_BASE_PATHS.SAML}/identity-providers/add`,
  SAML_IDP_EDIT: `${PLUGIN_BASE_PATHS.SAML}/identity-providers/edit`,
  SAML_SP_LIST: `${PLUGIN_BASE_PATHS.SAML}/service-providers`,
  SAML_SP_ADD: `${PLUGIN_BASE_PATHS.SAML}/service-providers/add`,
  SAML_SP_EDIT: `${PLUGIN_BASE_PATHS.SAML}/service-providers/edit`,

  // ========== SCIM Plugin ==========
  SCIM_BASE: PLUGIN_BASE_PATHS.SCIM,

  // ========== FIDO Plugin ==========
  FIDO_BASE: `${PLUGIN_BASE_PATHS.FIDO}/fidomanagement`,
  FIDO_STATIC_CONFIG: `${PLUGIN_BASE_PATHS.FIDO}/fidomanagement/static-configuration`,
  FIDO_DYNAMIC_CONFIG: `${PLUGIN_BASE_PATHS.FIDO}/fidomanagement/dynamic-configuration`,

  // ========== SMTP Plugin ==========
  SMTP_BASE: `${PLUGIN_BASE_PATHS.SMTP}/smtpmanagement`,

  // ========== Jans Lock Plugin ==========
  JANS_LOCK_BASE: PLUGIN_BASE_PATHS.JANS_LOCK,

  // ========== Core app pages ==========

  PROFILE: '/profile',
  LOGOUT: '/admin/logout',
  ERROR_404: '/error-404',

  // ========== Wildcard routes ==========
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

export { ROUTES, PLUGIN_BASE_PATHS }
