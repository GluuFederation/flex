import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

export const AUTH_RESOURCE_ID = ADMIN_UI_RESOURCES.Authentication
export const AUTH_SCOPES = CEDAR_RESOURCE_SCOPES[AUTH_RESOURCE_ID] || []

export const PAGE_SIZE = 10

export const TAB_ORDER = ['default_acr', 'builtIn', 'acrs', 'aliases', 'agama_flows'] as const
export const ALIASES_TAB_INDEX = TAB_ORDER.indexOf('aliases')

export interface BuiltInAcr {
  name: string
  level: number
  description: string
  samlACR: string
  primaryKey: string
  passwordAttribute: string
  hashAlgorithm: string
  defaultAuthNMethod: boolean
  acrName: string
}

export const BUILT_IN_ACRS: BuiltInAcr[] = [
  {
    name: 'simple_password_auth',
    level: -1,
    description: 'Built-in default password authentication',
    samlACR: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
    primaryKey: 'uid',
    passwordAttribute: 'userPassword',
    hashAlgorithm: 'bcrypt',
    defaultAuthNMethod: false,
    acrName: 'simple_password_auth',
  },
]
