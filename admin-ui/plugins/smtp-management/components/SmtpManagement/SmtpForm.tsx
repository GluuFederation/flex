import React, { useState, useContext, useEffect } from 'react'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { SelectChangeEvent } from '@mui/material'
import { useFormik } from 'formik'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { putConfigWorker } from 'Redux/features/authSlice'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { SmtpFormValues, SmtpFormProps } from '../../types'
import {
  toSmtpConfiguration,
  transformToFormValues,
  validationSchema,
  smtpConstants,
} from '../../helper'

function SmtpForm(props: Readonly<SmtpFormProps>) {
  const { item, handleSubmit, allowSmtpKeystoreEdit, onTestSmtp, formikRef } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || 'darkBlack'
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const initialValues: SmtpFormValues = transformToFormValues(item)

  const formik = useFormik<SmtpFormValues>({
    initialValues,
    onSubmit: () => {
      toggle()
    },
    validationSchema,
  })

  // Assign formik instance to ref for parent access
  useEffect(() => {
    if (formikRef) {
      formikRef.current = formik
    }
  }, [formik, formikRef])

  const submitForm = (userMessage: string) => {
    toggle()
    handleSubmit(toSmtpConfiguration(formik.values), userMessage)
  }

  const testSmtpConfig = () => {
    if (formik.isValid) {
      onTestSmtp({
        sign: true,
        subject: t('messages.smtp_test_subject'),
        message: t('messages.smtp_test_message'),
      })
    } else {
      toast.error(t('messages.mandatory_fields_required'))
    }
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent,
  ): void => {
    formik.handleChange(event)
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
    >
      <FormGroup row>
        <Col sm={8}>
          <GluuInputRow
            label="fields.smtp_host"
            name="host"
            value={formik.values.host || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.touched.host && !!formik.errors.host}
            errorMessage={formik.errors.host as string}
            handleChange={handleChange}
            required
          />
        </Col>
        <Col sm={8}>
          <GluuInputRow
            label="fields.smtp_port"
            name="port"
            value={formik.values.port || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.touched.port && !!formik.errors.port}
            errorMessage={formik.errors.port as string}
            handleChange={handleChange}
            type="number"
            required
          />
        </Col>
        <Col sm={8}>
          <GluuSelectRow
            label="fields.connect_protection"
            name="connect_protection"
            value={formik.values.connect_protection || ''}
            values={Object.values(smtpConstants.CONNECT_PROTECTION)}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.touched.connect_protection && !!formik.errors.connect_protection}
            errorMessage={formik.errors.connect_protection as string}
            handleChange={handleChange}
            required
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.from_name"
            name="from_name"
            value={formik.values.from_name || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.touched.from_name && !!formik.errors.from_name}
            errorMessage={formik.errors.from_name as string}
            handleChange={handleChange}
            required
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.from_email_address"
            name="from_email_address"
            value={formik.values.from_email_address || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.touched.from_email_address && !!formik.errors.from_email_address}
            errorMessage={formik.errors.from_email_address as string}
            handleChange={handleChange}
            required
          />
        </Col>
        <Col sm={8}>
          <GluuToogleRow
            label="fields.requires_authentication"
            name="requires_authentication"
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              formik.setFieldValue('requires_authentication', e.target.checked)
              handleChange(e)
            }}
            lsize={5}
            rsize={7}
            value={formik.values.requires_authentication || false}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.smtp_user_name"
            name="smtp_authentication_account_username"
            value={formik.values.smtp_authentication_account_username || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              formik.touched.smtp_authentication_account_username &&
              !!formik.errors.smtp_authentication_account_username
            }
            errorMessage={formik.errors.smtp_authentication_account_username as string}
            handleChange={handleChange}
            required={formik.values.requires_authentication}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.smtp_user_password"
            name="smtp_authentication_account_password"
            value={formik.values.smtp_authentication_account_password || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              formik.touched.smtp_authentication_account_password &&
              !!formik.errors.smtp_authentication_account_password
            }
            errorMessage={formik.errors.smtp_authentication_account_password as string}
            handleChange={handleChange}
            type="password"
            required={formik.values.requires_authentication}
          />
        </Col>
        <Col sm={8}>
          <GluuToogleRow
            label="fields.trust_host"
            name="trust_host"
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              formik.setFieldValue('trust_host', e.target.checked)
              handleChange(e)
            }}
            lsize={5}
            rsize={7}
            value={formik.values.trust_host || false}
          />
        </Col>
        <Col sm={8}>
          <GluuToogleRow
            label="fields.allow_keystore_edit"
            name="allowKeystoreEdit"
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              formik.setFieldValue('allowKeystoreEdit', e.target.checked)
              dispatch(putConfigWorker({ allowSmtpKeystoreEdit: e.target.checked }))
            }}
            lsize={5}
            rsize={7}
            value={allowSmtpKeystoreEdit}
          />
        </Col>
        <Col sm={8}>
          <GluuInputRow
            label="fields.key_store"
            name="key_store"
            value={formik.values.key_store || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.touched.key_store && !!formik.errors.key_store}
            errorMessage={formik.errors.key_store as string}
            handleChange={handleChange}
            disabled={!allowSmtpKeystoreEdit}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.key_store_password"
            name="key_store_password"
            value={formik.values.key_store_password || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.touched.key_store_password && !!formik.errors.key_store_password}
            errorMessage={formik.errors.key_store_password as string}
            handleChange={handleChange}
            type="password"
            disabled={!allowSmtpKeystoreEdit}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.key_store_alias"
            name="key_store_alias"
            value={formik.values.key_store_alias || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.touched.key_store_alias && !!formik.errors.key_store_alias}
            errorMessage={formik.errors.key_store_alias as string}
            handleChange={handleChange}
            disabled={!allowSmtpKeystoreEdit}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.signing_algorithm"
            name="signing_algorithm"
            value={formik.values.signing_algorithm || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.touched.signing_algorithm && !!formik.errors.signing_algorithm}
            errorMessage={formik.errors.signing_algorithm as string}
            handleChange={handleChange}
            disabled={!allowSmtpKeystoreEdit}
          />
        </Col>
      </FormGroup>
      <Row>
        <Col>
          <button
            type="button"
            className={`btn btn-primary-${selectedTheme} text-center`}
            onClick={testSmtpConfig}
            disabled={formik.dirty}
            title={formik.dirty ? t('messages.save_before_test') : ''}
          >
            {t('fields.test')}
          </button>
        </Col>
        <Col>
          <GluuCommitFooter
            saveHandler={toggle}
            hideButtons={{ save: true, back: true }}
            type="submit"
          />
        </Col>
      </Row>
      <GluuCommitDialog
        feature={adminUiFeatures.smtp_configuration_edit}
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
      />
    </Form>
  )
}
export default SmtpForm
