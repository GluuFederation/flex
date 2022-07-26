import React, { useState } from 'react'
import { Col, Container, FormGroup } from 'Components'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import { useTranslation } from 'react-i18next'
const DOC_CATEGORY = 'openid_client'

function ClientLogoutPanel({ client, scripts, formik }) {
  const { t } = useTranslation()

  scripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  function uriValidator(uri) {
    return uri
  }

  const postLogoutRedirectUris = []
  function postUriValidator(uri) {
    return uri
  }
  const post_uri_id = 'post_uri_id'

  const backchannelLogoutUris = []
  function uriValidator(uri) {
    return uri
  }
  const backchannel_uri_id = 'backchannel_uri_id'

  return (
    <Container>
      <GluuInputRow
        label="fields.frontChannelLogoutUri"
        name="frontChannelLogoutUri"
        formik={formik}
        value={client.frontChannelLogoutUri}
        doc_category={DOC_CATEGORY}
        lsize={4}
        rsize={8}
      />
      <GluuTypeAheadWithAdd
        name="postLogoutRedirectUris"
        label="fields.post_logout_redirect_uris"
        formik={formik}
        placeholder={t('placeholders.post_logout_redirect_uris')}
        value={client.postLogoutRedirectUris || []}
        options={postLogoutRedirectUris}
        validator={postUriValidator}
        inputId={post_uri_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd>

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
      <GluuBooleanSelectBox
        name="backchannelLogoutSessionRequired"
        label="fields.backchannelLogoutSessionRequired"
        value={client.backchannelLogoutSessionRequired}
        formik={formik}
        lsize={4}
        rsize={8}
        doc_category={DOC_CATEGORY}
      />

      <GluuToogleRow
        name="frontChannelLogoutSessionRequired"
        lsize={4}
        rsize={8}
        formik={formik}
        label="fields.frontChannelLogoutSessionRequired"
        value={client.frontChannelLogoutSessionRequired}
        doc_category={DOC_CATEGORY}
      />
    </Container>
  )
}

export default ClientLogoutPanel
