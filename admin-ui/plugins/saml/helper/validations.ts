import * as Yup from 'yup'
import { REGEX_NO_WHITESPACE } from '@/utils/regex'
import type { SamlConfigurationFormValues } from '../types'
import type { TFunction } from 'i18next'
import type {
  WebsiteSsoIdentityProviderFormValues,
  FileLikeObject,
  WebsiteSsoServiceProviderFormValues,
} from '../types'

export const getSamlConfigurationValidationSchema = (
  t: TFunction,
): Yup.ObjectSchema<SamlConfigurationFormValues> => {
  const required = (label: string) => t('validation_messages.field_required', { field: t(label) })

  return Yup.object({
    enabled: Yup.boolean().required(required('fields.enabled')),
    selectedIdp: Yup.string().when('enabled', {
      is: true,
      then: (schema) =>
        schema.required(required('fields.selected_idp')).min(1, required('fields.selected_idp')),
      otherwise: (schema) => schema,
    }),
    ignoreValidation: Yup.boolean(),
    applicationName: Yup.string(),
  }) as Yup.ObjectSchema<SamlConfigurationFormValues>
}

// Helper function to create required field when metadata file is not imported
const requiredWhenMetadataNotImported = (t: TFunction, fieldKey: string) =>
  Yup.string().when('metaDataFileImportedFlag', {
    is: (value: boolean) => value === false,
    then: () =>
      Yup.string().required(t('validation_messages.field_required', { field: t(fieldKey) })),
    otherwise: () => Yup.string(),
  })

const noSpacesValidation = (t: TFunction, fieldKey: string) =>
  Yup.string().matches(
    REGEX_NO_WHITESPACE,
    t('errors.cannot_contain_spaces', { field: t(fieldKey) }),
  )

// Helper function to validate URL format
const urlFormatTest = (t: TFunction, fieldKey: string) =>
  Yup.string().test(
    'url-format',
    t('errors.must_be_valid_url', { field: t(fieldKey) }),
    function (value) {
      if (!value || value.trim().length === 0) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
  )

// Helper function to validate URL fields (no spaces + valid URL)
const urlValidation = (t: TFunction, fieldKey: string) =>
  noSpacesValidation(t, fieldKey).concat(urlFormatTest(t, fieldKey))

export const websiteSsoIdentityProviderValidationSchema = (
  t: TFunction,
): Yup.ObjectSchema<WebsiteSsoIdentityProviderFormValues> =>
  Yup.object().shape({
    name: noSpacesValidation(t, 'fields.name').required(
      t('validation_messages.field_required', { field: t('fields.name') }),
    ),
    displayName: noSpacesValidation(t, 'fields.displayName').required(
      t('validation_messages.field_required', { field: t('fields.displayName') }),
    ),
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
    ).concat(urlValidation(t, 'fields.single_signon_service_url')),
    idpEntityId: Yup.string()
      .concat(noSpacesValidation(t, 'fields.idp_entity_id'))
      .when('metaDataFileImportedFlag', ([value], schema) =>
        value === false
          ? schema
              .required(
                t('validation_messages.field_required', { field: t('fields.idp_entity_id') }),
              )
              .test(
                'not-empty',
                t('errors.cannot_be_empty', { field: t('fields.idp_entity_id') }),
                (v) => {
                  if (!v) return true // Required validation handles empty
                  return v.trim().length > 0
                },
              )
          : schema,
      ),
    nameIDPolicyFormat: requiredWhenMetadataNotImported(t, 'fields.name_policy_format'),
    singleLogoutServiceUrl: Yup.string()
      .nullable()
      .concat(urlValidation(t, 'fields.single_logout_service_url')),
    signingCertificate: Yup.string().nullable(),
    encryptionPublicKey: Yup.string().nullable(),
    principalAttribute: Yup.string()
      .nullable()
      .concat(noSpacesValidation(t, 'fields.principal_attribute')),
    principalType: Yup.string().nullable().concat(noSpacesValidation(t, 'fields.principal_type')),
  }) as Yup.ObjectSchema<WebsiteSsoIdentityProviderFormValues>

// Helper to create required validation when spMetaDataSourceType is 'manual'
const requiredWhenManualTest = (t: TFunction, fieldKey: string) =>
  Yup.string()
    .nullable()
    .test(
      'required-when-manual',
      t('validation_messages.field_required', { field: t(fieldKey) }),
      function (value) {
        // Access parent form values through Yup's context
        const parent = this.from?.[1]?.value as { spMetaDataSourceType?: string } | undefined
        const isManual = parent?.spMetaDataSourceType?.toLowerCase() === 'manual'
        if (isManual && (!value || value.trim() === '')) {
          return false
        }
        return true
      },
    )

export const websiteSsoServiceProviderValidationSchema = (
  t: TFunction,
): Yup.ObjectSchema<WebsiteSsoServiceProviderFormValues> =>
  Yup.object().shape({
    displayName: noSpacesValidation(t, 'fields.displayName').required(
      t('validation_messages.field_required', { field: t('fields.displayName') }),
    ),
    name: noSpacesValidation(t, 'fields.name').required(
      t('validation_messages.field_required', { field: t('fields.name') }),
    ),
    spLogoutURL: Yup.string()
      .nullable()
      .concat(urlValidation(t, 'fields.service_provider_logout_url')),
    spMetaDataSourceType: Yup.string().required(
      t('validation_messages.field_required', { field: t('fields.metadata_location') }),
    ),
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
      singleLogoutServiceUrl: requiredWhenManualTest(t, 'fields.single_logout_service_url').concat(
        urlValidation(t, 'fields.single_logout_service_url'),
      ),
      entityId: requiredWhenManualTest(t, 'fields.entity_id')
        .test(
          'not-empty',
          t('errors.cannot_be_empty', { field: t('fields.entity_id') }),
          (value) => {
            if (!value) return true // Required validation handles empty
            return value.trim().length > 0
          },
        )
        .concat(noSpacesValidation(t, 'fields.entity_id')),
      nameIDPolicyFormat: requiredWhenManualTest(t, 'fields.name_id_policy_format'),
      jansAssertionConsumerServiceGetURL: requiredWhenManualTest(
        t,
        'fields.jans_assertion_consumer_service_get_url',
      ).concat(urlValidation(t, 'fields.jans_assertion_consumer_service_get_url')),
      jansAssertionConsumerServicePostURL: requiredWhenManualTest(
        t,
        'fields.jans_assertion_consumer_service_post_url',
      ).concat(urlValidation(t, 'fields.jans_assertion_consumer_service_post_url')),
    }),
  }) as Yup.ObjectSchema<WebsiteSsoServiceProviderFormValues>
