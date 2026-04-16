import type { Client } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { formatDate } from '@/utils/dayjsUtils'
import type {
  ClientRow,
  ClientFormInitialData,
  ClientTokenRow,
  ClientWizardFormValues,
  TokenSearchFilterField,
  TokenSearchPattern,
} from '../types'
import { TOKEN_CSV_FILENAME, TOKEN_CSV_MIME_TYPE, TOKEN_DATE_QUERY_FORMAT } from '../constants'
import { uriValidator } from 'Plugins/auth-server/utils'

const toValidUriOrUndefined = (value: string | null | undefined): string | undefined => {
  if (!value || !uriValidator(value)) return undefined
  return value
}

export const buildClientInitialValues = (
  client_data: ClientFormInitialData,
): ClientWizardFormValues => ({
  inum: client_data.inum,
  dn: client_data.dn,
  clientSecret: client_data.clientSecret,
  displayName: client_data.displayName,
  clientName: client_data.clientName,
  description: client_data.description,
  applicationType: client_data.applicationType,
  subjectType: client_data.subjectType,
  registrationAccessToken: client_data.registrationAccessToken,
  clientIdIssuedAt: client_data.clientIdIssuedAt,
  initiateLoginUri: client_data.initiateLoginUri,
  logoUri: client_data.logoUri,
  clientUri: client_data.clientUri,
  tosUri: client_data.tosUri,
  jwksUri: client_data.jwksUri,
  jwks: client_data.jwks,
  expirable: !!client_data.expirationDate,
  expirationDate: client_data.expirationDate,
  softwareStatement: client_data.softwareStatement,
  softwareVersion: client_data.softwareVersion,
  softwareId: client_data.softwareId,
  idTokenSignedResponseAlg: client_data.idTokenSignedResponseAlg,
  idTokenEncryptedResponseAlg: client_data.idTokenEncryptedResponseAlg,
  tokenEndpointAuthMethod: client_data.tokenEndpointAuthMethod,
  accessTokenSigningAlg: client_data.accessTokenSigningAlg,
  idTokenEncryptedResponseEnc: client_data.idTokenEncryptedResponseEnc,
  requestObjectEncryptionAlg: client_data.requestObjectEncryptionAlg,
  requestObjectSigningAlg: client_data.requestObjectSigningAlg,
  requestObjectEncryptionEnc: client_data.requestObjectEncryptionEnc,
  userInfoEncryptedResponseAlg: client_data.userInfoEncryptedResponseAlg,
  userInfoSignedResponseAlg: client_data.userInfoSignedResponseAlg,
  userInfoEncryptedResponseEnc: client_data.userInfoEncryptedResponseEnc,
  idTokenTokenBindingCnf: client_data.idTokenTokenBindingCnf,
  backchannelUserCodeParameter: client_data.backchannelUserCodeParameter ?? false,
  refreshTokenLifetime: client_data.refreshTokenLifetime,
  defaultMaxAge: client_data.defaultMaxAge,
  accessTokenLifetime: client_data.accessTokenLifetime,
  backchannelTokenDeliveryMode: client_data.backchannelTokenDeliveryMode,
  backchannelClientNotificationEndpoint: client_data.backchannelClientNotificationEndpoint,
  frontChannelLogoutUri: toValidUriOrUndefined(client_data.frontChannelLogoutUri),
  policyUri: client_data.policyUri,
  sectorIdentifierUri: client_data.sectorIdentifierUri,
  redirectUris: client_data.redirectUris ?? [],
  claimRedirectUris: client_data.claimRedirectUris ?? [],
  authorizedOrigins: client_data.authorizedOrigins ?? [],
  requestUris: client_data.requestUris ?? [],
  postLogoutRedirectUris: client_data.postLogoutRedirectUris ?? [],
  responseTypes: client_data.responseTypes ?? [],
  grantTypes: client_data.grantTypes ?? [],
  contacts: client_data.contacts,
  defaultAcrValues: client_data.defaultAcrValues,
  scopes: client_data.scopes,
  attributes: client_data.attributes,
  frontChannelLogoutSessionRequired: client_data.frontChannelLogoutSessionRequired ?? false,
  customObjectClasses: client_data.customObjectClasses ?? [],
  trustedClient: client_data.trustedClient ?? false,
  persistClientAuthorizations: client_data.persistClientAuthorizations ?? false,
  includeClaimsInIdToken: client_data.includeClaimsInIdToken ?? false,
  rptAsJwt: client_data.rptAsJwt ?? false,
  accessTokenAsJwt: client_data.accessTokenAsJwt ?? false,
  disabled: client_data.disabled ?? false,
  deletable: client_data.deletable,
})

export const toClientJsonRecord = (
  value: Client | ClientRow | undefined,
): Record<string, JsonValue> => {
  if (!value) return {}
  return JSON.parse(JSON.stringify(value)) as Record<string, JsonValue>
}

export const buildClientTokenFieldValuePair = (
  clientInum: string,
  pattern: TokenSearchPattern,
  filterField: TokenSearchFilterField,
): string => {
  let query = `clnId=${clientInum}`
  if (pattern.dateAfter) {
    query += `,${filterField}>${formatDate(pattern.dateAfter, TOKEN_DATE_QUERY_FORMAT)}`
  }
  if (pattern.dateBefore) {
    query += `,${filterField}<${formatDate(pattern.dateBefore, TOKEN_DATE_QUERY_FORMAT)}`
  }
  return query
}

const TOKEN_CSV_KEYS: ReadonlyArray<keyof Omit<ClientTokenRow, 'attributes'>> = [
  'id',
  'tokenCode',
  'scope',
  'deletable',
  'grantType',
  'expirationDate',
  'creationDate',
  'tokenType',
]

export const convertTokensToCSV = (rows: ClientTokenRow[]): string => {
  if (!rows || rows.length === 0) return ''
  const escapeCsvValue = (value: string): string => {
    const escapedValue = value.replace(/"/g, '""')
    return /[",\n\r]/.test(escapedValue) ? `"${escapedValue}"` : escapedValue
  }

  const header = TOKEN_CSV_KEYS.map((key) =>
    escapeCsvValue(key.replace(/-/g, ' ').toUpperCase()),
  ).join(',')
  const body = rows.map((row) =>
    TOKEN_CSV_KEYS.map((key) => {
      const value = row[key]
      return escapeCsvValue(value != null ? String(value) : '')
    }).join(','),
  )
  return [header, ...body].join('\n')
}

export const getNextStep = <T>(steps: readonly T[], current: T): T =>
  steps[steps.indexOf(current) + 1]

export const getPrevStep = <T>(steps: readonly T[], current: T): T =>
  steps[steps.indexOf(current) - 1]

export const getClientAttributeValue = <T extends JsonValue = JsonValue>(
  values: { attributes?: Record<string, JsonValue | undefined> | null | undefined },
  key: string,
  fallback?: T,
): T | undefined => {
  const attrs = values.attributes
  if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
    const value = (attrs as Record<string, JsonValue>)[key]
    if (value !== undefined) return value as T
  }
  return fallback
}

export const downloadClientTokensCSV = (csv: string): void => {
  if (!csv || typeof window === 'undefined') return
  const blob = new Blob([csv], { type: TOKEN_CSV_MIME_TYPE })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', TOKEN_CSV_FILENAME)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
