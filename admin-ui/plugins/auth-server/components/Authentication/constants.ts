import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import type { BuiltInAcr } from './types'

export const AUTH_RESOURCE_ID = ADMIN_UI_RESOURCES.Authentication

export const PAGE_SIZE = 10

export const AUTH_METHOD_NAMES = {
  SIMPLE_PASSWORD: 'simple_password_auth',
  DEFAULT_LDAP: 'default_ldap_password',
} as const

export { SCRIPT_TYPES } from '@/constants'

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
  AGAMA_PROJECTS: 'agama_projects',
} as const

export type TabId = (typeof TAB_IDS)[keyof typeof TAB_IDS]

export const TAB_ORDER: readonly TabId[] = [
  TAB_IDS.DEFAULT_ACR,
  TAB_IDS.BUILT_IN,
  TAB_IDS.ACRS,
  TAB_IDS.ALIASES,
  TAB_IDS.AGAMA_PROJECTS,
]

export const getTabIndex = (tabId?: string): number =>
  Math.max(TAB_ORDER.indexOf(tabId as TabId), 0)

export const ALIASES_TAB_INDEX = getTabIndex(TAB_IDS.ALIASES)

export const ACR_TYPES = {
  BUILTIN: 'builtin',
  LDAP: 'ldap',
  SCRIPT: 'script',
  AGAMA: 'agama',
} as const

export type AcrType = (typeof ACR_TYPES)[keyof typeof ACR_TYPES]

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
    acrType: ACR_TYPES.BUILTIN,
  },
]
