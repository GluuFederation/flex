import React, { useState } from 'react'
import { Col, Container, FormGroup } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import Toggle from 'react-toggle'
import { useTranslation } from 'react-i18next'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
const DOC_CATEGORY = 'openid_client'

function ClientCibaParUmaPanel({ client, scripts, formik }) {
  const { t } = useTranslation()
  const claim_uri_id = 'claim_uri_id'
  const request_uri_id = 'request_uri_id'
  const origin_uri_id = 'origin_uri_id'
  const contact_uri_id = 'contact_uri_id'
  const cibaDeliveryModes = ['poll', 'push', 'ping']
  const contacts = []
  const claimRedirectURI = []
  const requestUris = []
  const authorizedOrigins = []
  scripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  function uriValidator(uri) {
    return uri
  }
  function getMapping(partial, total) {
    if (!partial) {
      partial = []
    }
    return total.filter((item) => partial.includes(item.dn))
  }
  const [softwareSection, setSoftwareSection] = useState(false)
  const [cibaSection, setCibaSection] = useState(false)

  function handleCibaSection() {
    setCibaSection(!cibaSection)
  }
  function handleSoftwareSection() {
    setSoftwareSection(!softwareSection)
  }
  function emailValidator(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email,
    )
  }
  return (
    <Container>
      <h2>CIBA</h2>
      <GluuSelectRow
        name="backchannelTokenDeliveryMode"
        label="fields.backchannelTokenDeliveryMode"
        formik={formik}
        value={client.backchannelTokenDeliveryMode}
        values={cibaDeliveryModes}
        doc_category={DOC_CATEGORY}
      ></GluuSelectRow>
      <GluuInputRow
        label="fields.backchannelClientNotificationEndpoint"
        name="backchannelClientNotificationEndpoint"
        formik={formik}
        value={client.backchannelClientNotificationEndpoint}
        doc_category={DOC_CATEGORY}
      />

      <GluuToogleRow
        name="backchannelUserCodeParameter"
        formik={formik}
        label="fields.backchannelUserCodeParameter"
        value={client.backchannelUserCodeParameter}
        doc_category={DOC_CATEGORY}
      />
      <h2>PAR</h2>
      <GluuInputRow
        label="fields.parLifetime"
        name="parLifetime"
        formik={formik}
        value={client.parLifetime}
        doc_category={DOC_CATEGORY}
      />
      <GluuToogleRow
        name="requirePar"
        formik={formik}
        label="fields.requirePar"
        value={client.requirePar}
        doc_category={DOC_CATEGORY}
      />
      <h2>UMA</h2>
      <FormGroup row>
        <GluuLabel label="fields.rptAsJwt" size={6} />
        <Col sm={6}>
          <RadioGroup
            row
            name="accessTokenAsJwt"
            value={client.rptAsJwt || true}
            onChange={(e) => {
              formik.setFieldValue('rptAsJwt', e.target.value == 'true')
            }}
          >
            <FormControlLabel
              value={true}
              control={<Radio color="primary" />}
              label="JWT"
              checked={client.rptAsJwt == true}
            />
            <FormControlLabel
              value={false}
              control={<Radio color="primary" />}
              label="Reference"
              checked={client.rptAsJwt == false}
            />
          </RadioGroup>
        </Col>
      </FormGroup>
      {/* <GluuToogleRow
        name="rptAsJwt"
        lsize={9}
        rsize={3}
        formik={formik}
        label="fields.rptAsJwt"
        value={client.rptAsJwt}
        doc_category={DOC_CATEGORY}
      /> */}

      <GluuTypeAheadWithAdd
        name="claimRedirectURIs"
        label="fields.claimRedirectURIs"
        formik={formik}
        placeholder={t('Enter a valid claim uri eg') + ' https://...'}
        value={client.claimRedirectUris || []}
        options={claimRedirectURI}
        validator={uriValidator}
        inputId={claim_uri_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd>
    </Container>
  )
}

export default ClientCibaParUmaPanel
