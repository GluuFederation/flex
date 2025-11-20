/**
 * Module property keys
 */
export const MODULE_PROPERTY_KEYS = {
  LOCATION_PATH: 'location_path',
  USAGE_TYPE: 'usage_type',
} as const

/**
 * Usage type options for person_authentication scripts
 */
export const USAGE_TYPE_OPTIONS = {
  INTERACTIVE: 'interactive',
  SERVICE: 'service',
  BOTH: 'both',
} as const

/**
 * Location type for script storage
 */
export const LOCATION_TYPES = {
  DATABASE: 'db',
  FILE: 'file',
} as const

/**
 * Programming language options
 */
export const PROGRAMMING_LANGUAGES = {
  PYTHON: 'python',
  JAVA: 'java',
} as const

/**
 * SAML ACR options for person_authentication
 */
export const SAML_ACR_OPTIONS = [
  { value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:InternetProtocol', label: 'Internet Protocol' },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:InternetProtocolPassword',
    label: 'Internet Protocol Password',
  },
  { value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:Kerberos', label: 'Kerberos' },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:MobileOneFactorUnregistered',
    label: 'Mobile One Factor Unregistered',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:MobileTwoFactorUnregistered',
    label: 'Mobile Two Factor Unregistered',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:MobileOneFactorContract',
    label: 'Mobile One Factor Contract',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:MobileTwoFactorContract',
    label: 'Mobile Two Factor Contract',
  },
  { value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:Password', label: 'Password' },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
    label: 'Password Protected Transport',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PreviousSession',
    label: 'Previous Session',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:X509',
    label: 'X509 Public Key',
  },
  { value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PGP', label: 'PGP' },
  { value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:SPKI', label: 'SPKI' },
  { value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:XMLDSig', label: 'XML Digital Signature' },
  { value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:Smartcard', label: 'Smartcard' },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI',
    label: 'Smartcard PKI',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:SoftwarePKI',
    label: 'Software PKI',
  },
  { value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:Telephony', label: 'Telephony' },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:NomadTelephony',
    label: 'Nomad Telephony',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PersonalTelephony',
    label: 'Personal Telephony',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:AuthenticatedTelephony',
    label: 'Authenticated Telephony',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:SecureRemotePassword',
    label: 'Secure Remote Password',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:TLSClient',
    label: 'TLS Client',
  },
  {
    value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:TimeSyncToken',
    label: 'Time Sync Token',
  },
  { value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:Unspecified', label: 'Unspecified' },
] as const

/**
 * Route paths for script management
 */
export const SCRIPT_ROUTES = {
  LIST: '/adm/scripts',
  ADD: '/adm/script/new',
  EDIT: (inum: string) => `/adm/script/edit/:${inum}`,
  VIEW: (inum: string) => `/adm/script/view/:${inum}`,
} as const

/**
 * Permission constants
 */
export const SCRIPT_PERMISSIONS = {
  READ: 'https://jans.io/oauth/config/scripts.readonly',
  WRITE: 'https://jans.io/oauth/config/scripts.write',
  DELETE: 'https://jans.io/oauth/config/scripts.delete',
} as const

/**
 * Audit resource type
 */
export const AUDIT_RESOURCE = 'SCRIPT'

/**
 * Audit actions
 */
export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETION: 'DELETION',
} as const

/**
 * Admin UI feature flags
 */
export const ADMIN_UI_FEATURES = {
  CUSTOM_SCRIPT_READ: 'custom_script_read',
  CUSTOM_SCRIPT_WRITE: 'custom_script_write',
  CUSTOM_SCRIPT_DELETE: 'custom_script_delete',
} as const

/**
 * Form field names
 */
export const FORM_FIELDS = {
  NAME: 'name',
  DESCRIPTION: 'description',
  SCRIPT_TYPE: 'scriptType',
  PROGRAMMING_LANGUAGE: 'programmingLanguage',
  LEVEL: 'level',
  ENABLED: 'enabled',
  SCRIPT: 'script',
  SCRIPT_PATH: 'script_path',
  LOCATION_PATH: 'locationPath',
  LOCATION_TYPE: 'location_type',
  ALIASES: 'aliases',
  MODULE_PROPERTIES: 'moduleProperties',
  CONFIGURATION_PROPERTIES: 'configurationProperties',
  ACTION_MESSAGE: 'action_message',
} as const

/**
 * Default pagination limit
 */
export const DEFAULT_PAGE_SIZE = 10

/**
 * Script type that requires special handling
 */
export const SPECIAL_SCRIPT_TYPES = {
  PERSON_AUTHENTICATION: 'person_authentication',
} as const

/**
 * Validation constants
 */
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 60,
  NAME_PATTERN: /^[a-zA-Z0-9_\-:/.]+$/,
  DESCRIPTION_MAX_LENGTH: 4000,
  SCRIPT_TYPE_MIN_LENGTH: 2,
  PROGRAMMING_LANGUAGE_MIN_LENGTH: 3,
  MIN_LEVEL: 1,
} as const

/**
 * Helper function to format script type name for display
 * @param type - Script type value (e.g., "person_authentication")
 * @returns Formatted display name (e.g., "Person Authentication")
 */
export function formatScriptTypeName(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Helper function to get script route
 * @param action - Route action (edit, view, list, add)
 * @param inum - Optional script inum
 * @returns Route path
 */
export function getScriptRoute(action: 'list' | 'add' | 'edit' | 'view', inum?: string): string {
  switch (action) {
    case 'list':
      return SCRIPT_ROUTES.LIST
    case 'add':
      return SCRIPT_ROUTES.ADD
    case 'edit':
      return inum ? SCRIPT_ROUTES.EDIT(inum) : SCRIPT_ROUTES.ADD
    case 'view':
      return inum ? SCRIPT_ROUTES.VIEW(inum) : SCRIPT_ROUTES.LIST
    default:
      return SCRIPT_ROUTES.LIST
  }
}
