import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import type { BuiltInAcr } from './types'

export const AUTH_RESOURCE_ID = ADMIN_UI_RESOURCES.Authentication
export const AUTH_SCOPES = CEDAR_RESOURCE_SCOPES[AUTH_RESOURCE_ID] || []

export const PAGE_SIZE = 10

export const AUTH_METHOD_NAMES = {
  SIMPLE_PASSWORD: 'simple_password_auth',
  DEFAULT_LDAP: 'default_ldap_password',
} as const

export const SCRIPT_TYPES = {
  PERSON_AUTHENTICATION: 'person_authentication',
} as const

export const JSON_PATCH_PATHS = {
  ACR_MAPPINGS: '/acrMappings',
} as const

export const JSON_PATCH_OPS = {
  REPLACE: 'replace',
  ADD: 'add',
  REMOVE: 'remove',
} as const

export const TAB_IDS = {
  DEFAULT_ACR: 'default_acr',
  BUILT_IN: 'builtIn',
  ACRS: 'acrs',
  ALIASES: 'aliases',
  AGAMA_FLOWS: 'agama_flows',
} as const

export const TAB_ORDER = [
  TAB_IDS.DEFAULT_ACR,
  TAB_IDS.BUILT_IN,
  TAB_IDS.ACRS,
  TAB_IDS.ALIASES,
  TAB_IDS.AGAMA_FLOWS,
] as const
export const ALIASES_TAB_INDEX = TAB_ORDER.indexOf(TAB_IDS.ALIASES)

export const BUILT_IN_ACRS: BuiltInAcr[] = [
  {
    name: AUTH_METHOD_NAMES.SIMPLE_PASSWORD,
    level: -1,
    description: 'Built-in default password authentication',
    samlACR: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
    primaryKey: 'uid',
    passwordAttribute: 'userPassword',
    hashAlgorithm: 'bcrypt',
    defaultAuthNMethod: false,
    acrName: AUTH_METHOD_NAMES.SIMPLE_PASSWORD,
  },
]
