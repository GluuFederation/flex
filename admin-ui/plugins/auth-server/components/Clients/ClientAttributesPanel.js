import React from 'react'
import { Container } from 'Components'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { useTranslation } from 'react-i18next'
const DOC_CATEGORY = 'openid_client'

function ClientAttributesPanel({ client, formik }) {
  const { t } = useTranslation()

  const backchannel_uri_id = 'backchannel_uri_id'
  const audience_id = 'audience_id'

  const backchannelLogoutUris = []
  const additionalAudiences = []
  function uriValidator(uri) {
    return uri
  }

  function audienceValidator(aud) {
    return aud
  }
  return (
    <Container>
      <GluuInputRow
        label="fields.tls_client_auth_subject_dn"
        name="tlsClientAuthSubjectDn"
        formik={formik}
        value={client.tlsClientAuthSubjectDn}
        doc_category={DOC_CATEGORY}
      />
      <GluuBooleanSelectBox
        name="runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims"
        label="fields.run_introspection_script_before_accesstoken"
        value={
          client.runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims
        }
        formik={formik}
        lsize={8}
        rsize={4}
        doc_category={DOC_CATEGORY}
      />
      <GluuBooleanSelectBox
        name="keepClientAuthorizationAfterExpiration"
        label="fields.keep_client_authorization"
        value={client.keepClientAuthorizationAfterExpiration}
        formik={formik}
        lsize={8}
        rsize={4}
        doc_category={DOC_CATEGORY}
      />
      <GluuBooleanSelectBox
        name="allowSpontaneousScopes"
        label="fields.allow_spontaneous_scopes"
        value={client.allowSpontaneousScopes}
        formik={formik}
        lsize={8}
        rsize={4}
        doc_category={DOC_CATEGORY}
      />
      <GluuBooleanSelectBox
        name="backchannelLogoutSessionRequired"
        label="fields.backchannelLogoutSessionRequired"
        value={client.backchannelLogoutSessionRequired}
        formik={formik}
        lsize={8}
        rsize={4}
        doc_category={DOC_CATEGORY}
      />
      <GluuTypeAheadWithAdd
        name="backchannelLogoutUri"
        label="fields.backchannelLogoutUri"
        formik={formik}
        placeholder={t('Enter a valid uri with pattern') + ' https://'}
        value={client.backchannelLogoutUri || []}
        options={backchannelLogoutUris}
        validator={uriValidator}
        inputId={backchannel_uri_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="additionalAudience"
        label="fields.additionalAudience"
        formik={formik}
        value={client.additionalAudience || []}
        options={additionalAudiences}
        validator={audienceValidator}
        inputId={audience_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd>
    </Container>
  )
}

export default ClientAttributesPanel
