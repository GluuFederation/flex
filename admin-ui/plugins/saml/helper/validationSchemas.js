import * as Yup from 'yup'

// Trust Relationship (Service Provider) form schema
export const buildTrustRelationSchema = (t) =>
  Yup.object().shape({
    displayName: Yup.string().required(`${t('fields.displayName')} is Required!`),
    name: Yup.string().required(`${t('fields.name')} is Required!`),
    spMetaDataSourceType: Yup.string().required(`${t('fields.metadata_location')} is Required!`),
    samlMetadata: Yup.object().shape({
      singleLogoutServiceUrl: Yup.string().when('$spMetaDataSourceType', {
        is: (val) => val === 'manual',
        then: (s) => s.required(`${t('fields.single_logout_service_url')} is Required!`),
        otherwise: (s) => s,
      }),
      entityId: Yup.string().when('$spMetaDataSourceType', {
        is: (val) => val === 'manual',
        then: (s) => s.required(`${t('fields.entity_id')} is Required!`),
        otherwise: (s) => s,
      }),
      nameIDPolicyFormat: Yup.string().when('$spMetaDataSourceType', {
        is: (val) => val === 'manual',
        then: (s) => s.required(`${t('fields.name_id_policy_format')} is Required!`),
        otherwise: (s) => s,
      }),
      jansAssertionConsumerServiceGetURL: Yup.string().when('$spMetaDataSourceType', {
        is: (val) => val === 'manual',
        then: (s) =>
          s.required(`${t('fields.jans_assertion_consumer_service_get_url')} is Required!`),
        otherwise: (s) => s,
      }),
      jansAssertionConsumerServicePostURL: Yup.string().when('$spMetaDataSourceType', {
        is: (val) => val === 'manual',
        then: (s) =>
          s.required(`${t('fields.jans_assertion_consumer_service_post_url')} is Required!`),
        otherwise: (s) => s,
      }),
    }),
  })

// Identity Provider form schema
export const buildSamlIdpSchema = (t) =>
  Yup.object().shape({
    singleSignOnServiceUrl: Yup.string().when('importMetadataFile', {
      is: (value) => value === false,
      then: () => Yup.string().required(`${t('fields.single_signon_service_url')} is Required!`),
    }),
    idpEntityId: Yup.string().when('importMetadataFile', {
      is: (value) => value === false,
      then: () => Yup.string().required(`${t('fields.idp_entity_id')} is Required!`),
    }),
    nameIDPolicyFormat: Yup.string().when('importMetadataFile', {
      is: (value) => value === false,
      then: () => Yup.string().required(`${t('fields.name_policy_format')} is Required!`),
    }),
    name: Yup.string().required(`${t('fields.name')} is Required!`),
    displayName: Yup.string().required(`${t('fields.displayName')} is Required!`),
  })
