import React, { useState } from 'react'
import { Col, Container, FormGroup, InputGroup, CustomInput } from 'Components'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
const DOC_CATEGORY = 'openid_client'

function ClientAdvancedPanel({ client, scripts, formik }) {
  const { t } = useTranslation()
  const request_uri_id = 'request_uri_id'
  const requestUris = []

  const [expirable, setExpirable] = useState(
    client.expirationDate ? client.expirationDate : false,
  )
  function handleExpirable() {
    setExpirable(!expirable)
  }

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
      <FormGroup row>
        <GluuLabel label="fields.subject_type" />
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="subjectType"
              name="subjectType"
              defaultValue={client.subjectType}
              onChange={formik.handleChange}
            >
              <option value="">{t('actions.choose')}...</option>
              <option>pairwise</option>
              <option>public</option>
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>
      <GluuInputRow
        label="fields.sector_uri"
        name="sectorIdentifierUri"
        formik={formik}
        value={client.sectorIdentifierUri}
        doc_category={DOC_CATEGORY}
      />
      <GluuToogleRow
        name="persistClientAuthorizations"
        lsize={9}
        rsize={3}
        formik={formik}
        label="fields.persist_client_authorizations"
        value={client.persistClientAuthorizations}
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
      <GluuInputRow
        label="fields.spontaneousScopes"
        name="spontaneousScopes"
        formik={formik}
        value={client.spontaneousScopes}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.initiateLoginUri"
        name="initiateLoginUri"
        formik={formik}
        value={client.initiateLoginUri}
        doc_category={DOC_CATEGORY}
      />
      <GluuTypeAheadWithAdd
        name="requestUris"
        label="fields.requestUris"
        formik={formik}
        placeholder={t('Enter a valid request uri eg') + ' https://...'}
        value={client.requestUris || []}
        options={requestUris}
        validator={uriValidator}
        inputId={request_uri_id}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadForDn
        name="defaultAcrValues"
        label="fields.defaultAcrValues"
        formik={formik}
        value={getMapping(client.defaultAcrValues, scripts)}
        options={scripts}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadForDn>
      <GluuInputRow
        label="fields.authorizedAcrValues"
        name="authorizedAcrValues"
        formik={formik}
        value={client.authorizedAcrValues}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.defaultPromptLogin"
        name="defaultPromptLogin"
        formik={formik}
        value={client.defaultPromptLogin}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.tls_client_auth_subject_dn"
        name="tlsClientAuthSubjectDn"
        formik={formik}
        value={client.tlsClientAuthSubjectDn}
        doc_category={DOC_CATEGORY}
      />

      {client.expirable && (
        <GluuToogleRow
          name="expirable"
          formik={formik}
          label="fields.is_expirable_client"
          value={client.expirable && client.expirable.length ? true : false}
          handler={handleExpirable}
          doc_category={DOC_CATEGORY}
        />
      )}
      {client.expirable && client.expirable.length && (
        <FormGroup row>
          <GluuLabel label="client_expiration_date" size={5} />
          <Col sm={7}>
            <DatePicker
              id="expirationDate"
              name="expirationDate"
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm:aa"
              timeFormat="HH:mm:aa"
              selected={client.expirationDate}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              onChange={(e) => formik.setFieldValue('expirationDate', e)}
            />
          </Col>
        </FormGroup>
      )}
    </Container>
  )
}

export default ClientAdvancedPanel
