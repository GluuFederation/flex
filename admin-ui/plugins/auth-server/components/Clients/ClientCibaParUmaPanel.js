import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import { Col, Container, FormGroup } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { useTranslation } from 'react-i18next'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
const DOC_CATEGORY = 'openid_client'

function ClientCibaParUmaPanel({ client, umaResources, scripts, formik }) {
  const { t } = useTranslation()
  const claim_uri_id = 'claim_uri_id'

  const cibaDeliveryModes = ['poll', 'push', 'ping']

  const claimRedirectURI = []

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

  const rptScripts = scripts
    .filter((item) => item.scriptType == 'UMA_RPT_CLAIMS')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

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
      <h2>{t(`titles.CIBA`)}</h2>
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
      <h2>{t(`titles.PAR`)}</h2>
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
      <h2>{t(`titles.UMA`)}</h2>
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
        lsize={3}
        rsize={9}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadForDn
        name="rptClaimsScripts"
        label="fields.rpt_scripts"
        formik={formik}
        value={client.rptClaimsScripts}
        options={rptScripts}
        doc_category={DOC_CATEGORY}
        doc_entry="rptClaimsScripts"
        lsize={3}
      ></GluuTypeAheadForDn>
      <FormGroup row>
        <GluuLabel label={'Resources'} size={3} />
        <Col sm={9}>
          {umaResources.length > 0 && umaResources?.map(uma => {
            return (
              <Box key={uma.id}>
                <Box display="flex">
                  <Box>
                    <Link to={`/auth-server/client/uma/${uma.id}`} className="common-link">
                      {uma.id}
                    </Link>
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Col>
      </FormGroup>
    </Container>
  )
}

export default ClientCibaParUmaPanel
