export const JANS_SERVICES = {
  AUTH: 'jans-auth',
  CONFIG_API: 'jans-config-api',
  FIDO2: 'jans-fido2',
  CASA: 'jans-casa',
  KEYCLOAK: 'keycloak',
  SCIM: 'jans-scim',
  LOCK: 'jans-lock',
  LINK: 'jans-link',
} as const

export type JansServiceName = (typeof JANS_SERVICES)[keyof typeof JANS_SERVICES]
