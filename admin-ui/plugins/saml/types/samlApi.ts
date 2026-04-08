import type { BasicUserInfo } from 'Utils/AuditLogger'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export const TrustRelationshipSpMetaDataSourceType = {
  FILE: 'FILE',
  URL: 'URL',
  MANUAL: 'MANUAL',
} as const

export type SamlAppConfiguration = {
  enabled?: boolean
  selectedIdp?: string
  ignoreValidation?: boolean
  applicationName?: string
}

export type OrvalIdentityProvider = {
  inum?: string
  name?: string
  displayName?: string
  description?: string
  enabled?: boolean
  idpMetaDataFN?: string
  trustEmail?: boolean
  linkOnly?: boolean
  creatorId?: string
  dn?: string
  providerId?: string
  realm?: string
  addReadTokenRoleOnCreate?: boolean
  authenticateByDefault?: boolean
  storeToken?: boolean
  baseDn?: string
  singleSignOnServiceUrl?: string
  nameIDPolicyFormat?: string
  idpEntityId?: string
  singleLogoutServiceUrl?: string
  signingCertificate?: string
  encryptionPublicKey?: string
  principalAttribute?: string
  principalType?: string
  validateSignature?: string
}

export type OrvalTrustRelationship = {
  inum?: string
  name?: string
  displayName?: string
  description?: string
  enabled?: boolean
  spMetaDataSourceType?: string
  spMetaDataFN?: string
  spMetaDataURL?: string
  spLogoutURL?: string
  releasedAttributes?: string[]
  redirectUris?: string[]
  clientAuthenticatorType?: string
  profileConfigurations?: Record<string, { name: string; signResponses: string }>
  dn?: string
  validationLog?: string[]
  validationStatus?: string
  secret?: string
  status?: string
  owner?: string
  consentRequired?: boolean
  metaLocation?: string
  baseDn?: string
  registrationAccessToken?: string
  baseUrl?: string
  alwaysDisplayInConsole?: boolean
  samlMetadata?: {
    nameIDPolicyFormat?: string
    entityId?: string
    singleLogoutServiceUrl?: string
    jansAssertionConsumerServiceGetURL?: string
    jansAssertionConsumerServicePostURL?: string
  }
}

export type IdentityProvider = OrvalIdentityProvider & {
  idpMetaDataFN?: string
  config?: {
    singleSignOnServiceUrl?: string
    nameIDPolicyFormat?: string
    idpEntityId?: string
    singleLogoutServiceUrl?: string
    signingCertificate?: string
    encryptionPublicKey?: string
    principalAttribute?: string
    principalType?: string
    validateSignature?: string
  }
}

export type TrustRelationship = OrvalTrustRelationship & {
  spMetaDataFN?: string
}

export type BrokerIdentityProviderForm = {
  identityProvider: IdentityProvider
  metaDataFile?: File | Blob
}

export type TrustRelationshipForm = {
  trustRelationship: TrustRelationship | Record<string, JsonValue>
  metaDataFile?: File | Blob
}

export type GetSamlIdentityProviderParams = {
  startIndex?: number
  limit?: number
  pattern?: string
}

export type IdentityProviderPagedResult = {
  entries?: IdentityProvider[]
  totalEntriesCount?: number
}

export type SamlAuditContext = {
  userinfo: BasicUserInfo | null | undefined
  clientId: string | undefined
  ipAddress: string | undefined
}

export type UpdateSamlConfigurationParams = {
  data: SamlAppConfiguration
  userMessage: string
}

export type CreateIdentityProviderParams = {
  data: BrokerIdentityProviderForm
  userMessage: string
}

export type UpdateIdentityProviderParams = {
  data: BrokerIdentityProviderForm
  userMessage: string
}

export type DeleteIdentityProviderParams = {
  inum: string
  userMessage: string
}

export type CreateTrustRelationshipParams = {
  data: TrustRelationshipForm
  userMessage: string
}

export type UpdateTrustRelationshipParams = {
  data: TrustRelationshipForm
  userMessage: string
}

export type DeleteTrustRelationshipParams = {
  id: string
  userMessage: string
}
