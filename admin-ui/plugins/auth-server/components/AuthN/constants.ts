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
