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
const DOC_CATEGORY = 'openid_client'

function ClientSoftwarePanel({ client, scripts, formik }) {
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
      <GluuInputRow
        label="fields.clientUri"
        name="clientUri"
        formik={formik}
        value={client.clientUri}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.policy_uri"
        name="policyUri"
        formik={formik}
        value={client.policyUri}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.logo_uri"
        name="logoUri"
        formik={formik}
        value={client.logoUri}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.tosUri"
        name="tosUri"
        formik={formik}
        value={client.tosUri}
        doc_category={DOC_CATEGORY}
      />
      <GluuTypeAheadWithAdd
        name="contacts"
        label="fields.contacts"
        formik={formik}
        placeholder="Eg. sample@org.com"
        value={client.contacts || []}
        options={contacts}
        validator={emailValidator}
        inputId={contact_uri_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="authorizedOrigins"
        label="fields.authorizedOrigins"
        formik={formik}
        placeholder={t('Enter a valid origin uri eg') + ' https://...'}
        value={client.authorizedOrigins || []}
        options={authorizedOrigins}
        validator={uriValidator}
        inputId={origin_uri_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd>
      {/* <FormGroup row>
        <GluuLabel label="fields.show_software_settings" size={6} />
        <Col sm={2}>
          <Toggle
            name="softwareSection"
            defaultChecked={client.softwareSection}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup> */}

      <GluuInputRow
        label="fields.softwareId"
        name="softwareId"
        formik={formik}
        value={client.softwareId}
        doc_category={DOC_CATEGORY}
      />

      <GluuInputRow
        label="fields.softwareVersion"
        name="softwareVersion"
        formik={formik}
        value={client.softwareVersion}
        doc_category={DOC_CATEGORY}
      />

      <GluuInputRow
        label="fields.softwareStatement"
        name="softwareStatement"
        formik={formik}
        value={client.softwareStatement}
        doc_category={DOC_CATEGORY}
      />
    </Container>
  )
}

export default ClientSoftwarePanel
