import * as Yup from 'yup'
import type { SamlConfigurationFormValues } from '../types'
import type { TFunction } from 'i18next'
import type {
  WebsiteSsoIdentityProviderFormValues,
  FileLikeObject,
  WebsiteSsoServiceProviderFormValues,
} from '../types/formValues'

// Re-export types for backward compatibility
export type {
  WebsiteSsoIdentityProviderFormValues,
  FileLikeObject,
  WebsiteSsoServiceProviderFormValues,
} from '../types/formValues'
export const samlConfigurationValidationSchema: Yup.ObjectSchema<SamlConfigurationFormValues> =
  Yup.object({
    enabled: Yup.boolean().required('Enabled field is required.'),
    selectedIdp: Yup.string().when('enabled', {
      is: true,
      then: (schema) =>
        schema
          .required('Selected IdP is required when SAML is enabled.')
          .min(1, 'Selected IdP cannot be empty when SAML is enabled.'),
      otherwise: (schema) => schema,
    }),
    ignoreValidation: Yup.boolean(),
    applicationName: Yup.string(),
  }) as Yup.ObjectSchema<SamlConfigurationFormValues>

// Helper function to create required field when metadata file is not imported
const requiredWhenMetadataNotImported = (t: TFunction, fieldKey: string) =>
  Yup.string().when('metaDataFileImportedFlag', {
    is: (value: boolean) => value === false,
    then: () => Yup.string().required(`${t(fieldKey)} is Required!`),
    otherwise: () => Yup.string(),
  })

export const websiteSsoIdentityProviderValidationSchema = (
  t: TFunction,
): Yup.ObjectSchema<WebsiteSsoIdentityProviderFormValues> =>
  Yup.object().shape({
    name: Yup.string()
      .required(`${t('fields.name')} is Required!`)
      .trim(),
    displayName: Yup.string()
      .required(`${t('fields.displayName')} is Required!`)
      .trim(),
    description: Yup.string().nullable(),
    enabled: Yup.boolean().required(),
    metaDataFileImportedFlag: Yup.boolean(),
    metaDataFile: Yup.mixed().when('metaDataFileImportedFlag', {
      is: (val: boolean) => val === true,
      then: (s) =>
        s.nullable().when(['metaDataFileImportedFlag', 'idpMetaDataFN'], {
          is: (metaDataFileImportedFlag: boolean, idpMetaDataFN: string | undefined) =>
            metaDataFileImportedFlag === true && !idpMetaDataFN,
          then: (schema) =>
            schema
              .required(`${t('messages.import_metadata_file')}`)
              .test('file-type', `${t('messages.import_metadata_file')}`, (value) => {
                if (value === null || value === undefined) return false
                if (value instanceof File) return true
                // Accept file-like objects with path, relativePath, or name
                if (typeof value === 'object' && value !== null) {
                  const obj = value as FileLikeObject
                  return (
                    (obj.path != null && String(obj.path).trim() !== '') ||
                    (obj.relativePath != null && String(obj.relativePath).trim() !== '') ||
                    (obj.name != null && String(obj.name).trim() !== '')
                  )
                }
                return false
              }),
          otherwise: (schema) => schema.nullable(), // Allow null when existing file is present
        }),
      otherwise: (s) => s.nullable(),
    }),
    manualMetadata: Yup.string().nullable(),
    idpMetaDataFN: Yup.string().nullable(),
    singleSignOnServiceUrl: requiredWhenMetadataNotImported(
      t,
      'fields.single_signon_service_url',
    ).when('metaDataFileImportedFlag', {
      is: (value: boolean) => value === false,
      then: (schema) => schema.url(`${t('fields.single_signon_service_url')} must be a valid URL`),
      otherwise: (schema) => schema,
    }),
    idpEntityId: requiredWhenMetadataNotImported(t, 'fields.idp_entity_id').trim(),
    nameIDPolicyFormat: requiredWhenMetadataNotImported(t, 'fields.name_policy_format'),
    singleLogoutServiceUrl: Yup.string()
      .nullable()
      .test(
        'url-format',
        `${t('fields.single_logout_service_url')} must be a valid URL`,
        function (value) {
          if (!value || value.trim().length === 0) return true
          try {
            new URL(value)
            return true
          } catch {
            return false
          }
        },
      ),
    signingCertificate: Yup.string().nullable(),
    encryptionPublicKey: Yup.string().nullable(),
    principalAttribute: Yup.string().nullable(),
    principalType: Yup.string().nullable(),
  }) as Yup.ObjectSchema<WebsiteSsoIdentityProviderFormValues>

// Helper function to create required field when metadata source is manual
const requiredWhenManual = (t: TFunction, fieldKey: string) =>
  Yup.string().when('$spMetaDataSourceType', {
    is: (val: string) => val === 'manual',
    then: (s) => s.required(`${t(fieldKey)} is Required!`),
    otherwise: (s) => s,
  })

export const websiteSsoServiceProviderValidationSchema = (
  t: TFunction,
): Yup.ObjectSchema<WebsiteSsoServiceProviderFormValues> =>
  Yup.object().shape({
    displayName: Yup.string().required(`${t('fields.displayName')} is Required!`),
    name: Yup.string().required(`${t('fields.name')} is Required!`),
    spMetaDataSourceType: Yup.string().required(`${t('fields.metadata_location')} is Required!`),
    metaDataFileImportedFlag: Yup.boolean(),
    metaDataFile: Yup.mixed().when('spMetaDataSourceType', {
      is: (val: string) => val?.toLowerCase() === 'file',
      then: (s) =>
        s.nullable().when(['metaDataFileImportedFlag', 'spMetaDataFN'], {
          is: (metaDataFileImportedFlag: boolean, spMetaDataFN: string) =>
            metaDataFileImportedFlag === true || Boolean(spMetaDataFN),
          then: (schema) => schema, // Allow null when existing file is present
          otherwise: (schema) =>
            schema
              .required(`${t('messages.import_metadata_file')}`)
              .test(
                'file-type',
                `${t('messages.import_metadata_file')}`,
                (value) => value instanceof File,
              ),
        }),
      otherwise: (s) => s.nullable(),
    }),
    samlMetadata: Yup.object().shape({
      singleLogoutServiceUrl: requiredWhenManual(t, 'fields.single_logout_service_url'),
      entityId: requiredWhenManual(t, 'fields.entity_id'),
      nameIDPolicyFormat: requiredWhenManual(t, 'fields.name_id_policy_format'),
      jansAssertionConsumerServiceGetURL: requiredWhenManual(
        t,
        'fields.jans_assertion_consumer_service_get_url',
      ),
      jansAssertionConsumerServicePostURL: requiredWhenManual(
        t,
        'fields.jans_assertion_consumer_service_post_url',
      ),
    }),
  }) as Yup.ObjectSchema<WebsiteSsoServiceProviderFormValues>

export default samlConfigurationValidationSchema
