import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import type { ApiAppConfiguration } from '../types'
import { LOG_LEVELS, LOG_LAYOUTS } from '../../Logging/utils'

const API_PROTECTION_TYPE = 'OAuth2'

const getConfigApiPropertiesSchemaShape = (
  t: TFunction,
): Record<keyof ApiAppConfiguration, Yup.AnySchema> => ({
  serviceName: Yup.string().nullable(),
  configOauthEnabled: Yup.boolean().nullable(),
  disableLoggerTimer: Yup.boolean().nullable(),
  disableAuditLogger: Yup.boolean().nullable(),
  customAttributeValidationEnabled: Yup.boolean().nullable(),
  acrValidationEnabled: Yup.boolean().nullable(),
  returnClientSecretInResponse: Yup.boolean().nullable(),
  returnEncryptedClientSecretInResponse: Yup.boolean().nullable(),
  apiApprovedIssuer: Yup.array()
    .of(Yup.string())
    .min(1, t('validation_messages.min_one_approved_issuer'))
    .nullable(),
  apiProtectionType: Yup.string()
    .test(
      'api-protection-type',
      t('validation_messages.api_protection_type_invalid', { type: API_PROTECTION_TYPE }),
      (value) => !value || value.toLowerCase() === API_PROTECTION_TYPE.toLowerCase(),
    )
    .nullable(),
  apiClientId: Yup.string().nullable(),
  apiClientPassword: Yup.string().nullable(),
  endpointInjectionEnabled: Yup.boolean().nullable(),
  authIssuerUrl: Yup.string().url(t('validation_messages.invalid_url_format')).nullable(),
  authOpenidConfigurationUrl: Yup.string()
    .url(t('validation_messages.invalid_url_format'))
    .nullable(),
  authOpenidIntrospectionUrl: Yup.string()
    .url(t('validation_messages.invalid_url_format'))
    .nullable(),
  authOpenidTokenUrl: Yup.string().url(t('validation_messages.invalid_url_format')).nullable(),
  authOpenidRevokeUrl: Yup.string().url(t('validation_messages.invalid_url_format')).nullable(),
  exclusiveAuthScopes: Yup.array()
    .of(Yup.string())
    .min(1, t('validation_messages.min_one_scope'))
    .nullable(),
  corsConfigurationFilters: Yup.array()
    .of(
      Yup.object({
        filterName: Yup.string().nullable(),
        corsEnabled: Yup.boolean().nullable(),
        corsAllowedOrigins: Yup.string().nullable(),
        corsAllowedMethods: Yup.string().nullable(),
        corsSupportCredentials: Yup.boolean().nullable(),
        corsLoggingEnabled: Yup.boolean().nullable(),
        corsPreflightMaxAge: Yup.number()
          .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
              return null
            }
            const num = Number(value)
            return isNaN(num) ? null : num
          })
          .min(0, t('validation_messages.must_be_non_negative'))
          .max(86400, t('validation_messages.cors_preflight_max_age_max'))
          .nullable(),
        corsRequestDecorate: Yup.boolean().nullable(),
      }),
    )
    .nullable(),
  loggingLevel: Yup.string()
    .oneOf([...LOG_LEVELS], t('messages.logging_level_invalid'))
    .nullable(),
  loggingLayout: Yup.string()
    .oneOf([...LOG_LAYOUTS], t('messages.logging_layout_invalid'))
    .nullable(),
  disableJdkLogger: Yup.boolean().nullable(),
  disableExternalLoggerConfiguration: Yup.boolean().nullable(),
  maxCount: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return null
      }
      const num = Number(value)
      return isNaN(num) ? null : num
    })
    .min(0, t('validation_messages.must_be_non_negative'))
    .max(10000, t('validation_messages.must_not_exceed', { max: 10000 }))
    .nullable(),
  acrExclusionList: Yup.array().of(Yup.string()).nullable(),
  userExclusionAttributes: Yup.array().of(Yup.string()).nullable(),
  userMandatoryAttributes: Yup.array().of(Yup.string()).nullable(),
  agamaConfiguration: Yup.object({
    mandatoryAttributes: Yup.array().of(Yup.string()).nullable(),
    optionalAttributes: Yup.array().of(Yup.string()).nullable(),
  }).nullable(),
  auditLogConf: Yup.object({
    enabled: Yup.boolean().nullable(),
    logData: Yup.boolean().nullable(),
    ignoreHttpMethod: Yup.array().of(Yup.string()).nullable(),
    ignoreAnnotation: Yup.array().of(Yup.string()).nullable(),
    ignoreObjectMapping: Yup.array()
      .of(
        Yup.object({
          name: Yup.string().nullable(),
          text: Yup.array().of(Yup.string()).nullable(),
        }),
      )
      .nullable(),
    headerAttributes: Yup.array().of(Yup.string()).nullable(),
    auditLogFilePath: Yup.string().nullable(),
    auditLogFileName: Yup.string().nullable(),
    auditLogDateFormat: Yup.string().nullable(),
  }).nullable(),
  dataFormatConversionConf: Yup.object({
    enabled: Yup.boolean().nullable(),
    ignoreHttpMethod: Yup.array().of(Yup.string()).nullable(),
  }).nullable(),
  plugins: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().nullable(),
        description: Yup.string().nullable(),
        className: Yup.string().nullable(),
      }),
    )
    .nullable(),
  assetMgtConfiguration: Yup.object({
    assetMgtEnabled: Yup.boolean().nullable(),
    assetServerUploadEnabled: Yup.boolean().nullable(),
    fileExtensionValidationEnabled: Yup.boolean().nullable(),
    moduleNameValidationEnabled: Yup.boolean().nullable(),
    assetDirMapping: Yup.array()
      .of(
        Yup.object({
          directory: Yup.string().nullable(),
          type: Yup.array()
            .of(Yup.string())
            .min(1, t('validation_messages.min_one_asset_type'))
            .nullable(),
          description: Yup.string().nullable(),
          jansServiceModule: Yup.array()
            .of(Yup.string())
            .min(1, t('validation_messages.min_one_service_module'))
            .nullable(),
        }),
      )
      .nullable(),
  }).nullable(),
})

const getConfigApiPropertiesSchema = (t: TFunction) =>
  Yup.object().shape(getConfigApiPropertiesSchemaShape(t)) as Yup.ObjectSchema<ApiAppConfiguration>

export { getConfigApiPropertiesSchema }
