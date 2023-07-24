import React, { useState } from 'react'
import { Col, Container, FormGroup, InputGroup, CustomInput } from 'Components'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { useTranslation } from 'react-i18next'
import ClientShowSpontaneousScopes from './ClientShowSpontaneousScopes'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
const DOC_CATEGORY = 'openid_client'

function ClientAdvancedPanel({ client, scripts, formik, viewOnly }) {
  const { t } = useTranslation()
  const request_uri_id = 'request_uri_id'
  const requestUris = []

  const [expirable, setExpirable] = useState(
    client.expirationDate ? client.expirationDate : false,
  )
  const [scopesModal, setScopesModal] = useState(false)
  const [expirationDate, setExpirationDate] = useState(expirable ? dayjs(expirable) : undefined)
  const handler = () => {
    setScopesModal(!scopesModal)
  }

  function handleExpirable() {
    setExpirable(!expirable)
  }

  scripts = scripts
    .filter((item) => item.scriptType == 'person_authentication')
    .filter((item) => item.enabled)
    .map((item) => (item.name))
  function uriValidator(uri) {
    return uri
  }
  function getMapping(partial, total) {
    if (!partial) {
      partial = []
    }
    return total.filter((item) => partial.includes(item))
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
  function getScopeMapping(exitingScopes, scopes) {
    if (!exitingScopes) {
      exitingScopes = []
    }
    return scopes.filter((item) => exitingScopes.includes(item.dn))
  }
  return (
    <Container>
      <ClientShowSpontaneousScopes handler={handler} isOpen={scopesModal} />
      <FormGroup row>
        <GluuLabel label="fields.subject_type" />
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="subjectType"
              name="subjectType"
              disabled={viewOnly}
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

      <GluuToogleRow
        name="persistClientAuthorizations"
        lsize={9}
        rsize={3}
        formik={formik}
        label="fields.persist_client_authorizations"
        value={client.persistClientAuthorizations}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuBooleanSelectBox
        name="allowSpontaneousScopes"
        label="fields.allow_spontaneous_scopes"
        value={client.allowSpontaneousScopes}
        formik={formik}
        lsize={3}
        rsize={9}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuTypeAheadForDn
        name="spontaneousScopes"
        label="fields.spontaneousScopesREGEX"
        formik={formik}
        value={formik.values.spontaneousScopes || []}
        options={formik.values.spontaneousScopes || []}
        haveLabelKey={false}
        allowNew={true}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
      ></GluuTypeAheadForDn>

      <GluuTooltip
        doc_category={DOC_CATEGORY}
        doc_entry="spontaneousScopesViewContent"
      >
        {client.inum && (
          <FormGroup row>
            <GluuLabel label="fields.spontaneousScopes" />
            <Col sm={9}>
              <a onClick={handler} className="common-link">
                View Current
              </a>
            </Col>
          </FormGroup>
        )}
      </GluuTooltip>
      <GluuInputRow
        label="fields.initiateLoginUri"
        name="initiateLoginUri"
        formik={formik}
        value={client.initiateLoginUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
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
        lsize={3}
        rsize={9}
        disabled={viewOnly}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAhead
        name="defaultAcrValues"
        label="fields.defaultAcrValues"
        formik={formik}
        value={getMapping(client.defaultAcrValues, scripts)}
        options={scripts}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="authorizedAcrValues"
        label="fields.authorizedAcrValues"
        formik={formik}
        value={getMapping(client.authorizedAcrValues, scripts)}
        options={scripts}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
      ></GluuTypeAhead>
      <GluuToogleRow
        name="jansDefaultPromptLogin"
        lsize={3}
        rsize={9}
        formik={formik}
        label="fields.defaultPromptLogin"
        value={client.jansDefaultPromptLogin}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuInputRow
        label="fields.tls_client_auth_subject_dn"
        name="tlsClientAuthSubjectDn"
        formik={formik}
        value={client.tlsClientAuthSubjectDn}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />

      <FormGroup row>
        <Col sm={6}>
          {client.expirable && (
            <GluuToogleRow
              name="expirable"
              formik={formik}
              label="fields.is_expirable_client"
              value={client.expirable?.length ? true : false}
              handler={handleExpirable}
              doc_category={DOC_CATEGORY}
              lsize={6}
              rsize={6}
              disabled={viewOnly}
            />
          )}
        </Col>
        <Col sm={6}>
          {client.expirable?.length ? (
            <FormGroup row>
              <Col sm={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    id="expirationDate"
                    name="expirationDate"
                    value={expirationDate}
                    onChange={(date) => {
                      formik.setFieldValue('expirationDate', new Date(date))
                      setExpirationDate(date)
                    }}
                  />
                </LocalizationProvider> 
              </Col>
            </FormGroup>
          ) : null}
        </Col>
      </FormGroup>
    </Container>
  )
}

export default ClientAdvancedPanel
