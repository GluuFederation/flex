import type { AuthNItem } from '../../atoms'

export const mockAcrs = {
  defaultAcr: 'simple_password_auth',
}

export const mockLdapConfigurations = [
  {
    configId: 'test-ldap',
    bindDN: 'cn=directory manager',
    bindPassword: 'test-password',
    servers: ['localhost:1636'],
    baseDNs: ['ou=people,o=jans'],
    primaryKey: 'uid',
    localPrimaryKey: 'uid',
    maxConnections: 10,
    useSSL: true,
    enabled: true,
    level: 1,
  },
]

export const mockScripts = [
  {
    inum: 'test-script-1',
    name: 'test_otp',
    scriptType: 'person_authentication',
    enabled: true,
    level: 5,
    description: 'Test OTP authentication script',
  },
]

export const mockAuthenticationItem: AuthNItem = {
  inum: 'test-inum',
  name: 'myAuthnScript',
  acrName: 'test_otp',
  level: 5,
  description: 'Test OTP authentication script',
  enabled: true,
}

export const mockBuiltInAuthenticationItem: AuthNItem = {
  name: 'simple_password_auth',
  acrName: 'simple_password_auth',
  level: -1,
  description: 'Built-in default password authentication',
  samlACR: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
  primaryKey: 'uid',
  passwordAttribute: 'userPassword',
  hashAlgorithm: 'bcrypt',
}
