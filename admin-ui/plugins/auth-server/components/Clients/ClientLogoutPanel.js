import React from 'react'
import { Container } from 'Components'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
const DOC_CATEGORY = 'openid_client'

function uriValidator(uri) {
  return uri
}
const post_uri_id = 'post_uri_id'
const postLogoutRedirectUris = []
function postUriValidator(uri) {
  return uri
}
const backchannelLogoutUris = []
const backchannel_uri_id = 'backchannel_uri_id'

function ClientLogoutPanel({ formik, viewOnly }) {
  const { t } = useTranslation()

  return (
    <Container>
      <GluuInputRow
        label="fields.frontChannelLogoutUri"
        name="frontChannelLogoutUri"
        formik={formik}
        value={formik.values.frontChannelLogoutUri}
        doc_category={DOC_CATEGORY}
        lsize={4}
        rsize={8}
        disabled={viewOnly}
      />
      <GluuTypeAheadWithAdd
        name="postLogoutRedirectUris"
        label="fields.post_logout_redirect_uris"
        formik={formik}
        placeholder={t('placeholders.post_logout_redirect_uris')}
        value={formik.values.postLogoutRedirectUris || []}
        options={postLogoutRedirectUris}
        validator={postUriValidator}
        inputId={post_uri_id}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      ></GluuTypeAheadWithAdd>

      <GluuTypeAheadWithAdd
        name="attributes.backchannelLogoutUri"
        label="fields.backchannelLogoutUri"
        formik={formik}
        placeholder={t('Enter a valid uri with pattern') + ' https://'}
        value={formik.values.attributes.backchannelLogoutUri || []}
        options={backchannelLogoutUris}
        validator={uriValidator}
        inputId={backchannel_uri_id}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      ></GluuTypeAheadWithAdd>
      <GluuBooleanSelectBox
        name="attributes.backchannelLogoutSessionRequired"
        label="fields.backchannelLogoutSessionRequired"
        value={formik.values.attributes.backchannelLogoutSessionRequired}
        formik={formik}
        lsize={4}
        rsize={8}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />

      <GluuToogleRow
        name="frontChannelLogoutSessionRequired"
        lsize={4}
        rsize={8}
        formik={formik}
        label="fields.frontChannelLogoutSessionRequired"
        value={formik.values.frontChannelLogoutSessionRequired}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
    </Container>
  )
}

export default ClientLogoutPanel
ClientLogoutPanel.propTypes = {
  formik: PropTypes.any,
  client: PropTypes.any,
  scripts: PropTypes.any,
  viewOnly: PropTypes.bool
}
