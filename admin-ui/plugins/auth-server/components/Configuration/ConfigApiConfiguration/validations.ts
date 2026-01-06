import * as Yup from 'yup'
import type { ApiAppConfiguration } from './types'

const configApiPropertiesSchemaShape: Record<keyof ApiAppConfiguration, Yup.AnySchema> = {
  serviceName: Yup.string().nullable(),
  configOauthEnabled: Yup.boolean().nullable(),
  disableLoggerTimer: Yup.boolean().nullable(),
  disableAuditLogger: Yup.boolean().nullable(),
  customAttributeValidationEnabled: Yup.boolean().nullable(),
  acrValidationEnabled: Yup.boolean().nullable(),
  returnClientSecretInResponse: Yup.boolean().nullable(),
  returnEncryptedClientSecretInResponse: Yup.boolean().nullable(),
  apiApprovedIssuer: Yup.array().of(Yup.string().nullable()).nullable(),
  apiProtectionType: Yup.string().nullable(),
  apiClientId: Yup.string().nullable(),
  apiClientPassword: Yup.string().nullable(),
  endpointInjectionEnabled: Yup.boolean().nullable(),
  authIssuerUrl: Yup.string().url().nullable(),
  authOpenidConfigurationUrl: Yup.string().url().nullable(),
  authOpenidIntrospectionUrl: Yup.string().url().nullable(),
  authOpenidTokenUrl: Yup.string().url().nullable(),
  authOpenidRevokeUrl: Yup.string().url().nullable(),
  exclusiveAuthScopes: Yup.array().of(Yup.string().nullable()).nullable(),
  corsConfigurationFilters: Yup.array()
    .of(
      Yup.object({
        filterName: Yup.string().nullable(),
        corsEnabled: Yup.boolean().nullable(),
        corsAllowedOrigins: Yup.string().nullable(),
        corsAllowedMethods: Yup.string().nullable(),
        corsSupportCredentials: Yup.boolean().nullable(),
        corsLoggingEnabled: Yup.boolean().nullable(),
        corsPreflightMaxAge: Yup.number().nullable(),
        corsRequestDecorate: Yup.boolean().nullable(),
      }),
    )
    .nullable(),
  loggingLevel: Yup.string().nullable(),
  loggingLayout: Yup.string().nullable(),
  disableJdkLogger: Yup.boolean().nullable(),
  disableExternalLoggerConfiguration: Yup.boolean().nullable(),
  maxCount: Yup.number().nullable(),
  acrExclusionList: Yup.array().of(Yup.string().nullable()).nullable(),
  userExclusionAttributes: Yup.array().of(Yup.string().nullable()).nullable(),
  userMandatoryAttributes: Yup.array().of(Yup.string().nullable()).nullable(),
  agamaConfiguration: Yup.object({
    mandatoryAttributes: Yup.array().of(Yup.string().nullable()).nullable(),
    optionalAttributes: Yup.array().of(Yup.string().nullable()).nullable(),
  }).nullable(),
  auditLogConf: Yup.object({
    enabled: Yup.boolean().nullable(),
    logData: Yup.boolean().nullable(),
    ignoreHttpMethod: Yup.array().of(Yup.string().nullable()).nullable(),
    ignoreAnnotation: Yup.array().of(Yup.string().nullable()).nullable(),
    ignoreObjectMapping: Yup.array()
      .of(
        Yup.object({
          name: Yup.string().nullable(),
          text: Yup.array().of(Yup.string().nullable()).nullable(),
        }),
      )
      .nullable(),
    headerAttributes: Yup.array().of(Yup.string().nullable()).nullable(),
    auditLogFilePath: Yup.string().nullable(),
    auditLogFileName: Yup.string().nullable(),
    auditLogDateFormat: Yup.string().nullable(),
  }).nullable(),
  dataFormatConversionConf: Yup.object({
    enabled: Yup.boolean().nullable(),
    ignoreHttpMethod: Yup.array().of(Yup.string().nullable()).nullable(),
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
          type: Yup.array().of(Yup.string().nullable()).nullable(),
          description: Yup.string().nullable(),
          jansServiceModule: Yup.array().of(Yup.string().nullable()).nullable(),
        }),
      )
      .nullable(),
  }).nullable(),
}

export const configApiPropertiesSchema = Yup.object().shape(
  configApiPropertiesSchemaShape,
) as Yup.ObjectSchema<ApiAppConfiguration>
