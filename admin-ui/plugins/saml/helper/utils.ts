import type { SamlConfigurationFormValues } from '../types'
import type { SamlConfiguration, SamlIdentity, TrustRelationship } from '../types/redux'
import type {
  WebsiteSsoIdentityProviderFormValues,
  WebsiteSsoTrustRelationshipFormValues,
} from './validations'

export const transformToFormValues = (
  configuration: SamlConfiguration | Record<string, string | number | boolean>,
): SamlConfigurationFormValues => {
  return {
    enabled: Boolean(configuration?.enabled),
    selectedIdp: String(configuration?.selectedIdp || ''),
    ignoreValidation: Boolean(configuration?.ignoreValidation),
    applicationName: String(configuration?.applicationName || ''),
  }
}

export const transformToIdentityProviderFormValues = (
  configs?: SamlIdentity | null,
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
  }
}

const getDefault = <T>(value: T | null, defaultValue: T): T => {
  return value != null ? value : defaultValue
}

const getConfiguredType = (configs: TrustRelationship | null): string => {
  if (configs?.spMetaDataSourceType) {
    return configs.spMetaDataSourceType
  }
  return ''
}

export const transformToTrustRelationshipFormValues = (
  configs?: TrustRelationship | null,
): WebsiteSsoTrustRelationshipFormValues => {
  return {
    ...(configs || {}),
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
  }
}

type FormValue = string | number | boolean | File | null
type FormValues = Record<string, FormValue>
type ConfigFields = Record<string, FormValue>
type RootFields = Record<string, FormValue>
type IdentityProviderPayload = RootFields & {
  config?: ConfigFields
  idpMetaDataFN?: string
  inum?: string
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

export const cleanOptionalFields = <T extends Record<string, unknown>>(
  obj: T,
  removeEmptyStrings = true,
): Partial<T> => {
  const cleaned: Partial<T> = {}

  Object.entries(obj).forEach(([key, value]) => {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      return
    }

    // Optionally skip empty strings
    if (removeEmptyStrings && typeof value === 'string' && value.trim() === '') {
      return
    }

    // Handle nested objects
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
      const cleanedNested = cleanOptionalFields(
        value as Record<string, unknown>,
        removeEmptyStrings,
      )
      // Only include nested object if it has at least one property
      if (Object.keys(cleanedNested).length > 0) {
        cleaned[key as keyof T] = cleanedNested as T[keyof T]
      }
      return
    }

    // Handle arrays - keep non-empty arrays
    if (Array.isArray(value)) {
      if (value.length > 0) {
        cleaned[key as keyof T] = value as T[keyof T]
      }
      return
    }

    // Keep all other values (strings, numbers, booleans, File objects, etc.)
    cleaned[key as keyof T] = value as T[keyof T]
  })

  return cleaned
}

export const buildIdentityProviderPayload = (
  rootFields: RootFields,
  configData: ConfigFields,
  inum?: string,
  metaDataFileImportedFlag?: boolean,
  idpMetaDataFN?: string,
): IdentityProviderPayload => {
  if (metaDataFileImportedFlag) {
    const payload = {
      ...rootFields,
    } as IdentityProviderPayload

    if (idpMetaDataFN) {
      payload.idpMetaDataFN = idpMetaDataFN
    }

    if (inum) {
      payload.inum = inum
    }

    return payload
  }

  const finalConfigData: ConfigFields = { ...configData }

  CONFIG_FIELDS.forEach((field) => {
    if (!(field in finalConfigData)) {
      finalConfigData[field] = ''
    } else {
      finalConfigData[field] = trimStringValue(finalConfigData[field])
    }
  })

  const payload = {
    ...rootFields,
    ...finalConfigData,
  } as IdentityProviderPayload

  if (inum) {
    payload.inum = inum
  }

  return payload
}
