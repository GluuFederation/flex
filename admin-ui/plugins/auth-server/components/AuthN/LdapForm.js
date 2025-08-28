import React, { useState, useCallback } from 'react'
import { useFormik } from 'formik'
import { Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useDispatch } from 'react-redux'
import { buildLdapPayload } from '../../helper'
import { STRINGS, ACTIONS, FEATURES } from '../../helper/constants'

function LdapForm({ ldapConfig: initialValues, isEdit, onSuccessApply }) {
  const [modal, setModal] = useState(false)
  const [userMessage, setUserMessage] = useState('')
  const formik = useFormik({
    initialValues,
    onSubmit: (values, { setSubmitting }) => {
      setModal(true)
      setSubmitting(false)
    },
  })

  const dispatch = useDispatch()
  const handleDialogAccept = useCallback(() => {
    const payload = buildLdapPayload(formik.values, userMessage)
    dispatch({ type: isEdit ? ACTIONS.EDIT_LDAP : ACTIONS.ADD_LDAP, payload, onSuccessApply })
    setModal(false)
    setUserMessage('')
  }, [formik.values, userMessage, isEdit, dispatch])

  return (
    <>
      <Form onSubmit={formik.handleSubmit} autoComplete="off">
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.acr}
          name="configId"
          value={formik.values.configId}
          formik={formik}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          disabled={isEdit}
          placeholder={STRINGS.authn.ldap.placeholders.acr}
          error={formik.touched.configId && formik.errors.configId}
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.level}
          name="level"
          type="number"
          value={formik.values.level}
          formik={formik}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          min={1}
          step={1}
          placeholder={STRINGS.authn.ldap.placeholders.level}
          error={formik.touched.level && formik.errors.level}
        />

        <GluuToogleRow
          label={STRINGS.authn.ldap.fields.default_authn_method}
          name="defaultAuthnMethod"
          formik={formik}
          value={formik.values.defaultAuthnMethod}
          handler={() =>
            formik.setFieldValue('defaultAuthnMethod', !formik.values.defaultAuthnMethod)
          }
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.bind_dn}
          name="bindDN"
          value={formik.values.bindDN}
          formik={formik}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.bind_dn}
          error={formik.touched.bindDN && formik.errors.bindDN}
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.max_connections}
          name="maxConnections"
          value={formik.values.maxConnections}
          formik={formik}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.max_connections}
          error={formik.touched.maxConnections && formik.errors.maxConnections}
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.local_primary_key}
          name="localPrimaryKey"
          value={formik.values.localPrimaryKey}
          formik={formik}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.local_primary_key}
          error={formik.touched.localPrimaryKey && formik.errors.localPrimaryKey}
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.remote_primary_key}
          name="primaryKey"
          value={formik.values.primaryKey}
          formik={formik}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.remote_primary_key}
          error={formik.touched.primaryKey && formik.errors.primaryKey}
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.remote_ldap_server}
          name="servers"
          value={formik.values?.servers}
          formik={formik}
          onChange={(e) => {
            const arr = e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
            formik.setFieldValue('servers', arr.length ? arr : [''])
          }}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.remote_ldap_server}
          error={
            formik.touched.servers &&
            (Array.isArray(formik.errors.servers)
              ? formik.errors.servers.join(', ')
              : formik.errors.servers)
          }
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.base_dns}
          name="baseDNs"
          value={formik.values.baseDNs}
          formik={formik}
          onChange={(e) => {
            const arr = e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
            formik.setFieldValue('baseDNs', arr.length ? arr : [''])
          }}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.base_dns}
          error={
            formik.touched.baseDNs &&
            (Array.isArray(formik.errors.baseDNs)
              ? formik.errors.baseDNs.join(', ')
              : formik.errors.baseDNs)
          }
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.bind_password}
          name="bindPassword"
          value={formik.values.bindPassword}
          formik={formik}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.bind_password}
          error={formik.touched.bindPassword && formik.errors.bindPassword}
        />
        <FormGroup row>
          <GluuToogleRow
            label="Use SSL"
            name="useSSL"
            formik={formik}
            value={formik.values.useSSL}
            handler={() => formik.setFieldValue('useSSL', !formik.values.useSSL)}
          />
        </FormGroup>
        <FormGroup row>
          <GluuToogleRow
            label="Enabled"
            name="enabled"
            formik={formik}
            value={formik.values.enabled}
            handler={() => formik.setFieldValue('enabled', !formik.values.enabled)}
          />
        </FormGroup>
        <GluuCommitFooter
          saveHandler={formik.handleSubmit}
          hideButtons={{ save: true }}
          type="submit"
        />
      </Form>
      <GluuCommitDialog
        handler={() => setModal(false)}
        modal={modal}
        onAccept={handleDialogAccept}
        formik={formik}
        placeholderLabel={STRINGS.authn.ldap.placeholders.action_commit_message}
        inputType="textarea"
        feature={FEATURES.LDAP_EDIT}
        operations={[]}
        isLicenseLabel={false}
      />
    </>
  )
}

export default LdapForm
