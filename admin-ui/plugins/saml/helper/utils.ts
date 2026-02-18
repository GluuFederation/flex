import type { SamlConfigurationFormValues } from '../types'
import type {
  SamlConfiguration,
  IdentityProviderPayload,
  WebsiteSsoServiceProviderPayload,
} from '../types/payloads'
import type {
  WebsiteSsoIdentityProviderFormValues,
  WebsiteSsoServiceProviderFormValues,
  FormValue,
  FormValues,
  ConfigFields,
  RootFields,
  CleanableValue,
} from '../types/formValues'
import type { IdentityProvider, TrustRelationship, SamlAppConfiguration } from '../components/hooks'

type IdentityProviderWithMetaDataFN = IdentityProvider & {
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
    [key: string]: unknown
  }
}

type TrustRelationshipWithMetaDataFN = TrustRelationship & {
  spMetaDataFN?: string
}

export const transformToFormValues = (
  configuration:
    | SamlConfiguration
    | SamlAppConfiguration
    | Record<string, string | number | boolean>
    | undefined,
): SamlConfigurationFormValues => {
  return {
    enabled: Boolean(configuration?.enabled),
    selectedIdp: String(configuration?.selectedIdp || ''),
    ignoreValidation: Boolean(configuration?.ignoreValidation),
    applicationName: String(configuration?.applicationName || ''),
  }
}

export const transformToIdentityProviderFormValues = (
  configs?: IdentityProviderWithMetaDataFN | null,
): WebsiteSsoIdentityProviderFormValues => {
  const config = configs?.config || {}
  const singleSignOnServiceUrl =
    config.singleSignOnServiceUrl || configs?.singleSignOnServiceUrl || ''
  const nameIDPolicyFormat = config.nameIDPolicyFormat || configs?.nameIDPolicyFormat || ''
  const idpEntityId = config.idpEntityId || configs?.idpEntityId || ''
  const singleLogoutServiceUrl =
    config.singleLogoutServiceUrl || configs?.singleLogoutServiceUrl || ''
  const signingCertificate = config.signingCertificate || configs?.signingCertificate || ''
  const encryptionPublicKey = config.encryptionPublicKey || configs?.encryptionPublicKey || ''
  const principalAttribute = config.principalAttribute || configs?.principalAttribute || ''
  const principalType = config.principalType || configs?.principalType || ''
  const validateSignature = config.validateSignature || ''

  return {
    name: configs?.name || '',
    displayName: configs?.displayName || '',
    description: configs?.description || '',
    enabled: configs?.enabled || false,
    nameIDPolicyFormat,
    singleSignOnServiceUrl,
    idpEntityId,
    singleLogoutServiceUrl,
    signingCertificate,
    encryptionPublicKey,
    principalAttribute,
    principalType,
    metaDataFileImportedFlag: !!configs?.idpMetaDataFN,
    metaDataFile: null,
    idpMetaDataFN: configs?.idpMetaDataFN || undefined,
    manualMetadata: '',
    validateSignature,
    trustEmail: configs?.trustEmail,
    linkOnly: configs?.linkOnly,
    creatorId: configs?.creatorId,
    dn: configs?.dn,
    providerId: configs?.providerId,
    realm: configs?.realm,
    addReadTokenRoleOnCreate: configs?.addReadTokenRoleOnCreate,
    authenticateByDefault: configs?.authenticateByDefault,
    storeToken: configs?.storeToken,
    baseDn: configs?.baseDn,
  }
}

const getDefault = <T>(value: T | null, defaultValue: T): T => {
  return value != null ? value : defaultValue
}

const getConfiguredType = (configs: TrustRelationshipWithMetaDataFN | null): string => {
  if (configs?.spMetaDataSourceType) {
    return configs.spMetaDataSourceType
  }
  return ''
}

export const transformToWebsiteSsoServiceProviderFormValues = (
  configs?: TrustRelationshipWithMetaDataFN | null,
): WebsiteSsoServiceProviderFormValues => {
  return {
    enabled: getDefault(configs?.enabled ?? null, false),
    name: getDefault(configs?.name ?? null, ''),
    displayName: getDefault(configs?.displayName ?? null, ''),
    description: getDefault(configs?.description ?? null, ''),
    spMetaDataSourceType: getConfiguredType(configs ?? null),
    releasedAttributes: getDefault(configs?.releasedAttributes ?? null, []),
    spLogoutURL: getDefault(configs?.spLogoutURL ?? null, ''),
    samlMetadata: {
      nameIDPolicyFormat: getDefault(configs?.samlMetadata?.nameIDPolicyFormat ?? null, ''),
      entityId: getDefault(configs?.samlMetadata?.entityId ?? null, ''),
      singleLogoutServiceUrl: getDefault(configs?.samlMetadata?.singleLogoutServiceUrl ?? null, ''),
      jansAssertionConsumerServiceGetURL: getDefault(
        configs?.samlMetadata?.jansAssertionConsumerServiceGetURL ?? null,
        '',
      ),
      jansAssertionConsumerServicePostURL: getDefault(
        configs?.samlMetadata?.jansAssertionConsumerServicePostURL ?? null,
        '',
      ),
    },
    metaDataFileImportedFlag: !!configs?.spMetaDataFN,
    metaDataFile: null,
    ...(configs?.spMetaDataFN ? { spMetaDataFN: configs.spMetaDataFN } : {}),
    clientAuthenticatorType: configs?.clientAuthenticatorType,
    spMetaDataURL: configs?.spMetaDataURL,
    redirectUris: configs?.redirectUris,
    profileConfigurations: configs?.profileConfigurations as
      | Record<string, { name: string; signResponses: string }>
      | undefined,
    dn: configs?.dn,
    validationLog: configs?.validationLog,
    validationStatus: configs?.validationStatus,
    secret: configs?.secret,
    status: configs?.status,
    owner: configs?.owner,
    consentRequired: configs?.consentRequired,
    metaLocation: configs?.metaLocation,
    baseDn: configs?.baseDn,
    registrationAccessToken: configs?.registrationAccessToken,
    baseUrl: configs?.baseUrl,
    alwaysDisplayInConsole: configs?.alwaysDisplayInConsole,
  }
}

const CONFIG_FIELDS = [
  'singleSignOnServiceUrl',
  'nameIDPolicyFormat',
  'idpEntityId',
  'singleLogoutServiceUrl',
  'signingCertificate',
  'encryptionPublicKey',
  'principalAttribute',
  'principalType',
  'validateSignature',
] as const

const trimStringValue = (value: FormValue): FormValue => {
  if (typeof value === 'string') {
    return value.trim()
  }
  return value
}

export const trimStringFields = (values: FormValues): FormValues => {
  return Object.entries(values).reduce((acc, [key, value]) => {
    acc[key] = trimStringValue(value)
    return acc
  }, {} as FormValues)
}

export const separateConfigFields = (
  values: FormValues,
): { rootFields: RootFields; configData: ConfigFields } => {
  const rootFields: RootFields = {}
  const configData: ConfigFields = {}

  Object.entries(values).forEach(([key, value]) => {
    const isConfigField = CONFIG_FIELDS.includes(key as (typeof CONFIG_FIELDS)[number])
    if (isConfigField) {
      configData[key] = trimStringValue(value)
    } else {
      rootFields[key] = trimStringValue(value)
    }
  })

  return { rootFields, configData }
}

export const cleanOptionalFields = <T extends Record<string, CleanableValue>>(
  obj: T,
  removeEmptyStrings = true,
): Partial<T> => {
  const cleaned: Partial<T> = {}

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    if (removeEmptyStrings && typeof value === 'string' && value.trim() === '') {
      return
    }

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
      const cleanedNested = cleanOptionalFields(
        value as Record<string, CleanableValue>,
        removeEmptyStrings,
      )
      if (Object.keys(cleanedNested).length > 0) {
        cleaned[key as keyof T] = cleanedNested as T[keyof T]
      }
      return
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        cleaned[key as keyof T] = value as T[keyof T]
      }
      return
    }

    cleaned[key as keyof T] = value as T[keyof T]
  })

  return cleaned
}

const getStringValue = (value: FormValue | undefined): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  return String(value)
}

const getBooleanValue = (value: FormValue | undefined, defaultValue = false): boolean => {
  if (value === null || value === undefined) return defaultValue
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim()
    return lower === 'true' || lower === '1'
  }
  return Boolean(value)
}

const getArrayValue = (value: FormValue | undefined): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item))
  }
  return []
}

export const buildIdentityProviderPayload = (
  rootFields: RootFields,
  configData: ConfigFields,
  inum?: string,
  _metaDataFileImportedFlag?: boolean,
  _idpMetaDataFN?: string,
): IdentityProviderPayload => {
  const payload: IdentityProviderPayload = {
    name: getStringValue(rootFields.name),
    displayName: getStringValue(rootFields.displayName),
    description: getStringValue(rootFields.description),
    enabled: getBooleanValue(rootFields.enabled, true),
    singleSignOnServiceUrl: getStringValue(
      configData.singleSignOnServiceUrl || rootFields.singleSignOnServiceUrl,
    ),
    nameIDPolicyFormat: getStringValue(
      configData.nameIDPolicyFormat || rootFields.nameIDPolicyFormat,
    ),
    idpEntityId: getStringValue(configData.idpEntityId || rootFields.idpEntityId),
    singleLogoutServiceUrl: getStringValue(
      configData.singleLogoutServiceUrl || rootFields.singleLogoutServiceUrl,
    ),
    signingCertificate: getStringValue(
      configData.signingCertificate || rootFields.signingCertificate,
    ),
    encryptionPublicKey: getStringValue(
      configData.encryptionPublicKey || rootFields.encryptionPublicKey,
    ),
    principalAttribute: getStringValue(
      configData.principalAttribute || rootFields.principalAttribute,
    ),
    principalType: getStringValue(configData.principalType || rootFields.principalType),
    spMetaDataLocation: getStringValue(rootFields.spMetaDataLocation),
    validateSignature: getStringValue(rootFields.validateSignature || configData.validateSignature),
    firstBrokerLoginFlowAlias: getStringValue(rootFields.firstBrokerLoginFlowAlias),
    spMetaDataURL: getStringValue(rootFields.spMetaDataURL),
    trustEmail: getBooleanValue(rootFields.trustEmail),
    linkOnly: getBooleanValue(rootFields.linkOnly),
    creatorId: getStringValue(rootFields.creatorId),
    dn: getStringValue(rootFields.dn),
    validationLog: getArrayValue(rootFields.validationLog),
    idpMetaDataURL: getStringValue(rootFields.idpMetaDataURL),
    validationStatus: getStringValue(rootFields.validationStatus) || 'In Progress',
    providerId: getStringValue(rootFields.providerId),
    realm: getStringValue(rootFields.realm),
    postBrokerLoginFlowAlias: getStringValue(rootFields.postBrokerLoginFlowAlias),
    status: getStringValue(rootFields.status) || 'active',
    addReadTokenRoleOnCreate: getBooleanValue(rootFields.addReadTokenRoleOnCreate),
    authenticateByDefault: getBooleanValue(rootFields.authenticateByDefault),
    storeToken: getBooleanValue(rootFields.storeToken),
    idpMetaDataLocation: getStringValue(rootFields.idpMetaDataLocation),
    baseDn: getStringValue(rootFields.baseDn),
  }

  if (inum) {
    payload.inum = inum
  }

  return payload
}

const getObjectValue = (
  value: FormValue | Record<string, { name: string; signResponses: string }> | undefined,
): Record<string, { name: string; signResponses: string }> => {
  if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
    return value as Record<string, { name: string; signResponses: string }>
  }
  return {}
}

export const buildWebsiteSsoServiceProviderPayload = (
  formValues: Omit<
    WebsiteSsoServiceProviderFormValues,
    'metaDataFileImportedFlag' | 'metaDataFile'
  >,
  inum?: string,
): WebsiteSsoServiceProviderPayload => {
  const payload: WebsiteSsoServiceProviderPayload = {
    enabled: getBooleanValue(formValues.enabled, true),
    spMetaDataSourceType: getStringValue(formValues.spMetaDataSourceType),
    name: getStringValue(formValues.name),
    displayName: getStringValue(formValues.displayName),
    description: getStringValue(formValues.description),
    releasedAttributes: getArrayValue(formValues.releasedAttributes),
    spLogoutURL: getStringValue(formValues.spLogoutURL),
    samlMetadata: {
      nameIDPolicyFormat: getStringValue(formValues.samlMetadata?.nameIDPolicyFormat),
      entityId: getStringValue(formValues.samlMetadata?.entityId),
      singleLogoutServiceUrl: getStringValue(formValues.samlMetadata?.singleLogoutServiceUrl),
      jansAssertionConsumerServiceGetURL: getStringValue(
        formValues.samlMetadata?.jansAssertionConsumerServiceGetURL,
      ),
      jansAssertionConsumerServicePostURL: getStringValue(
        formValues.samlMetadata?.jansAssertionConsumerServicePostURL,
      ),
    },
    clientAuthenticatorType: getStringValue(formValues.clientAuthenticatorType),
    spMetaDataURL: getStringValue(formValues.spMetaDataURL),
    redirectUris: getArrayValue(formValues.redirectUris),
    profileConfigurations: getObjectValue(formValues.profileConfigurations),
    dn: getStringValue(formValues.dn),
    validationLog: getArrayValue(formValues.validationLog),
    validationStatus: getStringValue(formValues.validationStatus) || 'In Progress',
    secret: getStringValue(formValues.secret),
    status: getStringValue(formValues.status) || 'active',
    owner: getStringValue(formValues.owner),
    consentRequired: getBooleanValue(formValues.consentRequired),
    metaLocation: getStringValue(formValues.metaLocation),
    baseDn: getStringValue(formValues.baseDn),
    registrationAccessToken: getStringValue(formValues.registrationAccessToken),
    baseUrl: getStringValue(formValues.baseUrl),
    alwaysDisplayInConsole: getBooleanValue(formValues.alwaysDisplayInConsole),
  }

  if (inum) {
    payload.inum = inum
  }

  return payload
}
