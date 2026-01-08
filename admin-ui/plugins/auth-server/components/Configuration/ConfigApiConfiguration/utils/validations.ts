import * as Yup from 'yup'
import type { ApiAppConfiguration } from '../types'
import { LOG_LEVELS, LOG_LAYOUTS } from '../../Defaults/utils'

const configApiPropertiesSchemaShape: Record<keyof ApiAppConfiguration, Yup.AnySchema> = {
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
    .min(1, 'At least one approved issuer is required')
    .nullable(),
  apiProtectionType: Yup.string()
    .oneOf(['OAuth2'], 'Invalid API protection type. Supported type is OAuth2')
    .nullable(),
  apiClientId: Yup.string().nullable(),
  apiClientPassword: Yup.string().nullable(),
  endpointInjectionEnabled: Yup.boolean().nullable(),
  authIssuerUrl: Yup.string().url('Invalid URL format').nullable(),
  authOpenidConfigurationUrl: Yup.string().url('Invalid URL format').nullable(),
  authOpenidIntrospectionUrl: Yup.string().url('Invalid URL format').nullable(),
  authOpenidTokenUrl: Yup.string().url('Invalid URL format').nullable(),
  authOpenidRevokeUrl: Yup.string().url('Invalid URL format').nullable(),
  exclusiveAuthScopes: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one scope is required')
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
          .min(0, 'Must be non-negative')
          .max(86400, 'Must not exceed 24 hours (86400 seconds)')
          .nullable(),
        corsRequestDecorate: Yup.boolean().nullable(),
      }),
    )
    .nullable(),
  loggingLevel: Yup.string()
    .oneOf([...LOG_LEVELS], 'Invalid logging level')
    .nullable(),
  loggingLayout: Yup.string()
    .oneOf([...LOG_LAYOUTS], 'Invalid logging layout')
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
    .min(0, 'Must be non-negative')
    .max(10000, 'Must not exceed 10000')
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
          type: Yup.array().of(Yup.string()).min(1, 'At least one type is required').nullable(),
          description: Yup.string().nullable(),
          jansServiceModule: Yup.array()
            .of(Yup.string())
            .min(1, 'At least one service module is required')
            .nullable(),
        }),
      )
      .nullable(),
  }).nullable(),
}

export const configApiPropertiesSchema = Yup.object().shape(
  configApiPropertiesSchemaShape,
) as Yup.ObjectSchema<ApiAppConfiguration>
