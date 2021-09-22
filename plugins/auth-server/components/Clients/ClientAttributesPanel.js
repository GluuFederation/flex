import React from 'react'
import { Container, FormGroup, Input, Col } from '../../../../app/components'
import GluuBooleanSelectBox from '../../../../app/routes/Apps/Gluu/GluuBooleanSelectBox'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuTypeAheadWithAdd from '../../../../app/routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { useTranslation } from 'react-i18next'

function ClientAttributesPanel({ client, formik }) {
  const { t } = useTranslation()

  const backchannel_uri_id = 'backchannel_uri_id'
  const audience_id = 'audience_id'

  const backchannelLogoutUris = []
  const additionalAudiences = []
  function uriValidator(uri) {
    return uri.startsWith('https://')
  }

  function audienceValidator(aud) {
    return aud != null
  }
  return (
    <Container>
      <FormGroup row>
        <GluuLabel label="fields.tls_client_auth_subject_dn" />
        <Col sm={9}>
          <Input
            id="tlsClientAuthSubjectDn"
            name="tlsClientAuthSubjectDn"
            defaultValue={client.tlsClientAuthSubjectDn}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <GluuBooleanSelectBox
        name="runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims"
        label="fields.run_introspection_script_before_accesstoken"
        value={
          client.runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims
        }
        formik={formik}
        lsize={8}
        rsize={4}
      />
      <GluuBooleanSelectBox
        name="keepClientAuthorizationAfterExpiration"
        label="fields.keep_client_authorization"
        value={client.keepClientAuthorizationAfterExpiration}
        formik={formik}
        lsize={8}
        rsize={4}
      />
      <GluuBooleanSelectBox
        name="allowSpontaneousScopes"
        label="fields.allow_spontaneous_scopes"
        value={client.attributes.allowSpontaneousScopes}
        formik={formik}
        lsize={8}
        rsize={4}
      />
      <GluuBooleanSelectBox
        name="backchannelLogoutSessionRequired"
        label="fields.backchannelLogoutSessionRequired"
        value={client.backchannelLogoutSessionRequired}
        formik={formik}
        lsize={8}
        rsize={4}
      />
      <GluuTypeAheadWithAdd
        name="backchannelLogoutUri"
        label="fields.backchannelLogoutUri"
        formik={formik}
        placeholder={t('Enter a valid uri with pattern') + ' https://'}
        value={client.attributes.backchannelLogoutUri || []}
        options={backchannelLogoutUris}
        validator={uriValidator}
        inputId={backchannel_uri_id}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="additionalAudience"
        label="fields.additionalAudience"
        formik={formik}
        value={client.attributes.additionalAudience || []}
        options={additionalAudiences}
        validator={audienceValidator}
        inputId={audience_id}
      ></GluuTypeAheadWithAdd>
    </Container>
  )
}

export default ClientAttributesPanel
