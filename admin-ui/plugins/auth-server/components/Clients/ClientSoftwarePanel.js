import React, { useState } from 'react'
import { Col, Container, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { useTranslation } from 'react-i18next'
const DOC_CATEGORY = 'openid_client'

function ClientSoftwarePanel({ client, scripts, formik, viewOnly }) {
  const { t } = useTranslation()

  const origin_uri_id = 'origin_uri_id'
  const contact_uri_id = 'contact_uri_id'
  const contacts = []
  const authorizedOrigins = []
  scripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  function uriValidator(uri) {
    return uri
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
        disabled={viewOnly}
      />
      <GluuInputRow
        label="fields.policy_uri"
        name="policyUri"
        formik={formik}
        value={client.policyUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuInputRow
        label="fields.logo_uri"
        name="logoUri"
        formik={formik}
        value={client.logoUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuInputRow
        label="fields.tosUri"
        name="tosUri"
        formik={formik}
        value={client.tosUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
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
        lsize={3}
        rsize={9}
        disabled={viewOnly}
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
        lsize={3}
        rsize={9}
        disabled={viewOnly}
      ></GluuTypeAheadWithAdd>

      <GluuInputRow
        label="fields.softwareId"
        name="softwareId"
        formik={formik}
        value={client.softwareId}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />

      <GluuInputRow
        label="fields.softwareVersion"
        name="softwareVersion"
        formik={formik}
        value={client.softwareVersion}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />

      <GluuInputRow
        label="fields.softwareStatement"
        name="softwareStatement"
        formik={formik}
        value={client.softwareStatement}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
    </Container>
  )
}

export default ClientSoftwarePanel
