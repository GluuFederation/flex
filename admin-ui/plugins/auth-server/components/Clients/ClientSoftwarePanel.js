import React from 'react'
import { Container } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { useTranslation } from 'react-i18next'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
const DOC_CATEGORY = 'openid_client'

const EMPTY = ''
const origin_uri_id = 'origin_uri_id'
const contact_uri_id = 'contact_uri_id'
const contacts = []
const authorizedOrigins = []

function uriValidator(uri) {
  return uri
}

function emailValidator(email) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
}

function ClientSoftwarePanel({ formik, viewOnly, modifiedFields, setModifiedFields }) {
  const { t } = useTranslation()

  return (
    <Container>
      <GluuInputRow
        label="fields.clientUri"
        name="clientUri"
        formik={formik}
        value={isEmpty(formik.values.clientUri) ? EMPTY : formik.values.clientUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'Client Uri': e.target.value,
          })
        }}
      />
      <GluuInputRow
        label="fields.policy_uri"
        name="policyUri"
        formik={formik}
        value={isEmpty(formik.values.policyUri) ? EMPTY : formik.values.policyUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'Policy Uri': e.target.value,
          })
        }}
      />
      <GluuInputRow
        label="fields.logo_uri"
        name="logoUri"
        formik={formik}
        value={isEmpty(formik.values.logoUri) ? EMPTY : formik.values.logoUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'logo Uri': e.target.value,
          })
        }}
      />
      <GluuInputRow
        label="fields.tosUri"
        name="tosUri"
        formik={formik}
        value={isEmpty(formik.values.tosUri) ? EMPTY : formik.values.tosUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'Tos Uri': e.target.value,
          })
        }}
      />
      <GluuTypeAheadWithAdd
        name="contacts"
        label="fields.contacts"
        formik={formik}
        placeholder="Eg. sample@org.com"
        value={formik.values.contacts || []}
        options={contacts}
        validator={emailValidator}
        inputId={contact_uri_id}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
        handler={(name, items) => {
          setModifiedFields({
            ...modifiedFields,
            Contacts: items,
          })
        }}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAheadWithAdd
        name="authorizedOrigins"
        label="fields.authorizedOrigins"
        formik={formik}
        placeholder={t('Enter a valid origin uri eg') + ' https://...'}
        value={formik.values.authorizedOrigins || []}
        options={authorizedOrigins}
        validator={uriValidator}
        inputId={origin_uri_id}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
        handler={(name, items) => {
          setModifiedFields({
            ...modifiedFields,
            'Authorized Origins': items,
          })
        }}
      ></GluuTypeAheadWithAdd>

      <GluuInputRow
        label="fields.softwareId"
        name="softwareId"
        formik={formik}
        value={formik.values.softwareId}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'Software Id': e.target.value,
          })
        }}
      />

      <GluuInputRow
        label="fields.softwareVersion"
        name="softwareVersion"
        formik={formik}
        value={formik.values.softwareVersion}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'Software Version': e.target.value,
          })
        }}
      />

      <GluuInputRow
        label="fields.softwareStatement"
        name="softwareStatement"
        formik={formik}
        value={formik.values.softwareStatement}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'Software Statement': e.target.value,
          })
        }}
      />
    </Container>
  )
}

ClientSoftwarePanel.propTypes = {
  formik: PropTypes.object,
  viewOnly: PropTypes.bool,
  modifiedFields: PropTypes.object,
  setModifiedFields: PropTypes.func,
}
export default ClientSoftwarePanel
