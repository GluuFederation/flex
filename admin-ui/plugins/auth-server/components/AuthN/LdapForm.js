import React, { useState, useCallback } from 'react'
import { useFormik } from 'formik'
import { Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { buildLdapPayload } from '../../helper'
import { getLdapValidationSchema } from '../../helper/validations'
import { STRINGS, ACTIONS, FEATURES } from '../../helper/constants'

function LdapForm({ ldapConfig: initialValues, isEdit, onSuccessApply }) {
  const [modal, setModal] = useState(false)
  const { t } = useTranslation()
  const formik = useFormik({
    initialValues,
    validationSchema: getLdapValidationSchema(t),
    onSubmit: ({ setSubmitting }) => {
      setModal(true)
      setSubmitting(false)
    },
  })

  const dispatch = useDispatch()
  const handleDialogAccept = useCallback(
    (userMessage) => {
      const payload = buildLdapPayload(formik.values, userMessage)
      dispatch({ type: isEdit ? ACTIONS.EDIT_LDAP : ACTIONS.ADD_LDAP, payload, onSuccessApply })
      setModal(false)
    },
    [formik.values, isEdit, dispatch, onSuccessApply],
  )

  return (
    <>
      <Form onSubmit={formik.handleSubmit} autoComplete="off">
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.acr}
          name="configId"
          value={formik.values.configId}
          formik={formik}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          disabled={isEdit}
          placeholder={STRINGS.authn.ldap.placeholders.acr}
          showError={Boolean(formik.touched.configId && formik.errors.configId)}
          errorMessage={formik.errors.configId}
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.level}
          name="level"
          type="number"
          value={formik.values.level}
          formik={formik}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          min={1}
          step={1}
          placeholder={STRINGS.authn.ldap.placeholders.level}
          showError={Boolean(formik.touched.level && formik.errors.level)}
          errorMessage={formik.errors.level}
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
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.bind_dn}
          showError={Boolean(formik.touched.bindDN && formik.errors.bindDN)}
          errorMessage={formik.errors.bindDN}
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.max_connections}
          name="maxConnections"
          value={formik.values.maxConnections}
          formik={formik}
          type="number"
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.max_connections}
          showError={Boolean(formik.touched.maxConnections && formik.errors.maxConnections)}
          errorMessage={formik.errors.maxConnections}
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.local_primary_key}
          name="localPrimaryKey"
          value={formik.values.localPrimaryKey}
          formik={formik}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.local_primary_key}
          showError={Boolean(formik.touched.localPrimaryKey && formik.errors.localPrimaryKey)}
          errorMessage={formik.errors.localPrimaryKey}
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.remote_primary_key}
          name="primaryKey"
          value={formik.values.primaryKey}
          formik={formik}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.remote_primary_key}
          showError={Boolean(formik.touched.primaryKey && formik.errors.primaryKey)}
          errorMessage={formik.errors.primaryKey}
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.remote_ldap_server}
          name="servers"
          value={Array.isArray(formik.values?.servers) ? formik.values.servers.join(', ') : ''}
          formik={formik}
          handleChange={(e) => {
            const arr = e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
            formik.setFieldValue('servers', arr.length ? arr : [''])
          }}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.remote_ldap_server}
          showError={Boolean(formik.touched.servers && formik.errors.servers)}
          errorMessage={
            Array.isArray(formik.errors.servers)
              ? formik.errors.servers.join(', ')
              : formik.errors.servers
          }
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.base_dns}
          name="baseDNs"
          value={Array.isArray(formik.values.baseDNs) ? formik.values.baseDNs.join(', ') : ''}
          formik={formik}
          handleChange={(e) => {
            const arr = e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
            formik.setFieldValue('baseDNs', arr.length ? arr : [''])
          }}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.base_dns}
          showError={Boolean(formik.touched.baseDNs && formik.errors.baseDNs)}
          errorMessage={
            Array.isArray(formik.errors.baseDNs)
              ? formik.errors.baseDNs.join(', ')
              : formik.errors.baseDNs
          }
        />
        <GluuInputRow
          label={STRINGS.authn.ldap.fields.bind_password}
          name="bindPassword"
          value={formik.values.bindPassword}
          formik={formik}
          type="password"
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder={STRINGS.authn.ldap.placeholders.bind_password}
          showError={Boolean(formik.touched.bindPassword && formik.errors.bindPassword)}
          errorMessage={formik.errors.bindPassword}
        />
        <FormGroup row>
          <GluuToogleRow
            label={STRINGS.authn.ldap.fields.use_ssl || 'Use SSL'}
            name="useSSL"
            formik={formik}
            value={formik.values.useSSL}
            handler={() => formik.setFieldValue('useSSL', !formik.values.useSSL)}
          />
        </FormGroup>
        <FormGroup row>
          <GluuToogleRow
            label={STRINGS.authn.ldap.fields.enabled || 'Enabled'}
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
        placeholderLabel={t(STRINGS.authn.ldap.placeholders.action_commit_message)}
        inputType="textarea"
        feature={FEATURES.LDAP_EDIT}
        operations={[]}
        isLicenseLabel={false}
      />
    </>
  )
}

export default LdapForm
