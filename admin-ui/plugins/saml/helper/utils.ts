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
  return {
    ...(configs || {}),
    name: configs?.name || '',
    nameIDPolicyFormat: configs?.nameIDPolicyFormat || '',
    singleSignOnServiceUrl: configs?.singleSignOnServiceUrl || '',
    idpEntityId: configs?.idpEntityId || '',
    displayName: configs?.displayName || '',
    description: configs?.description || '',
    metaDataFileImportedFlag: false,
    enabled: configs?.enabled || false,
    principalAttribute: configs?.principalAttribute || '',
    principalType: configs?.principalType || '',
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
    metaDataFileImportedFlag: configs?.spMetaDataFN ? true : false,
    metaDataFile: null,
  }
}
