import * as Yup from 'yup'
import type { SamlConfigurationFormValues } from '../types'
import type { TFunction } from 'i18next'

export interface WebsiteSsoIdentityProviderFormValues {
  name: string
  nameIDPolicyFormat: string
  singleSignOnServiceUrl: string
  idpEntityId: string
  displayName: string
  description: string
  metaDataFileImportedFlag?: boolean
  enabled: boolean
  principalAttribute: string
  principalType: string
  singleLogoutServiceUrl?: string
  signingCertificate?: string
  encryptionPublicKey?: string
  idpMetaDataFN?: string
  manualMetadata?: string
}

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
    singleSignOnServiceUrl: requiredWhenMetadataNotImported(t, 'fields.single_signon_service_url'),
    idpEntityId: requiredWhenMetadataNotImported(t, 'fields.idp_entity_id'),
    nameIDPolicyFormat: requiredWhenMetadataNotImported(t, 'fields.name_policy_format'),
    // Manual metadata is now provided via a file upload (fields.manual_metadata),
    // so we no longer require a text value here.
    manualMetadata: Yup.string(),
    name: Yup.string().required(`${t('fields.name')} is Required!`),
    displayName: Yup.string().required(`${t('fields.displayName')} is Required!`),
  }) as Yup.ObjectSchema<WebsiteSsoIdentityProviderFormValues>

export interface WebsiteSsoTrustRelationshipFormValues {
  enabled: boolean
  name: string
  displayName: string
  description: string
  spMetaDataSourceType: string
  releasedAttributes: string[]
  spLogoutURL: string
  samlMetadata: {
    nameIDPolicyFormat: string
    entityId: string
    singleLogoutServiceUrl: string
    jansAssertionConsumerServiceGetURL: string
    jansAssertionConsumerServicePostURL: string
  }
  metaDataFileImportedFlag?: boolean
  metaDataFile?: File | null
  spMetaDataFN?: string
}

// Helper function to create required field when metadata source is manual
const requiredWhenManual = (t: TFunction, fieldKey: string) =>
  Yup.string().when('$spMetaDataSourceType', {
    is: (val: string) => val === 'manual',
    then: (s) => s.required(`${t(fieldKey)} is Required!`),
    otherwise: (s) => s,
  })

export const websiteSsoTrustRelationshipValidationSchema = (
  t: TFunction,
): Yup.ObjectSchema<WebsiteSsoTrustRelationshipFormValues> =>
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
  }) as Yup.ObjectSchema<WebsiteSsoTrustRelationshipFormValues>

export default samlConfigurationValidationSchema
