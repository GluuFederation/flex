import React, { useState, useContext } from 'react'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'
import { testSmtp } from 'Plugins/smtp-management/redux/features/smtpSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { putConfigWorker } from 'Redux/features/authSlice'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
function SmtpForm({ item, handleSubmit, allowSmtpKeystoreEdit }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [modal, setModal] = useState(false)
  const [hideTestButton, setHideTestButton] = useState(false)
  const [tempItems, setTempItems] = useState(item)
  const toggle = () => {
    setModal(!modal)
  }

  const initialValues = {
    host: item?.host || '',
    port: item?.port || '',
    connect_protection: item?.connect_protection || 'None',
    from_name: item?.from_name || '',
    from_email_address: item?.from_email_address || '',
    requires_authentication: item?.requires_authentication || false,
    smtp_authentication_account_username: item?.smtp_authentication_account_username || '',
    smtp_authentication_account_password: item?.smtp_authentication_account_password || '',
    trust_host: item?.trust_host || false,
    key_store: item?.key_store || '',
    key_store_password: item?.key_store_password || '',
    key_store_alias: item?.key_store_alias || '',
    signing_algorithm: item?.signing_algorithm || '',
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      toggle()
    },
    validationSchema: Yup.object({
      host: Yup.string().required('Host name is required.'),
      port: Yup.number().required('Port number is required.'),
      connect_protection: Yup.string()
        .min(2, 'Connection Protection is required.')
        .required('Connection Protection is required.'),
      from_name: Yup.string().required('From name is required.'),
      from_email_address: Yup.string()
        .email('Please add a valid email address.')
        .required('From email address is required.'),
      smtp_authentication_account_username: Yup.string().required('SMTP user name is required.'),
      smtp_authentication_account_password: Yup.string().required(
        'SMTP user password is required.',
      ),
    }),
    setFieldValue: (field) => {
      delete values[field]
    },
  })

  const submitForm = () => {
    toggle()
    handleSubmit(formik.values)
  }

  const testSmtpConfig = () => {
    const isValidate = checkValue()
    if (isValidate) {
      const opts = {}
      const smtpData = JSON.stringify({
        sign: true,
        subject: 'Testing Email',
        message: 'Testing',
      })
      opts['smtpTest'] = JSON.parse(smtpData)
      dispatch(testSmtp({ payload: opts }))
    } else {
      toast.error(t('messages.mandatory_fields_required'))
    }
  }

  const checkValue = () => {
    for (var key in formik.values) {
      if (
        (formik.values[key] === null || formik.values[key] == '') &&
        !['key_store', 'key_store_password', 'key_store_alias', 'signing_algorithm'].includes(key)
      )
        return false
    }
    return true
  }

  const handleChange = (event) => {
    const temp = { ...tempItems }
    temp[event.target.name] =
      event.target.type == 'number'
        ? parseInt(event.target.value)
        : event.target.type == 'select-one'
          ? event.target.value == 'true'
            ? true
            : false
          : event.target.value

    if (JSON.stringify(temp) !== JSON.stringify(item)) {
      setHideTestButton(true)
    } else {
      setHideTestButton(false)
    }
    setTempItems({ ...tempItems, [event.target.name]: event.target.value })
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
            showError={formik.errors.host && formik.touched.host}
            errorMessage={formik.errors.host}
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
            showError={formik.errors.port && formik.touched.port}
            errorMessage={formik.errors.port}
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
            defaultValue={formik.values.connect_protection || ''}
            values={['None', 'StartTls', 'SslTls']}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.errors.connect_protection && formik.touched.connect_protection}
            errorMessage={formik.errors.connect_protection}
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
            showError={formik.errors.from_name && formik.touched.from_name}
            errorMessage={formik.errors.from_name}
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
            showError={formik.errors.from_email_address && formik.touched.from_email_address}
            errorMessage={formik.errors.from_email_address}
            handleChange={handleChange}
            required
          />
        </Col>
        <Col sm={8}>
          <GluuToogleRow
            label="fields.requires_authentication"
            name="requires_authentication"
            handler={(e) => {
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
              formik.errors.smtp_authentication_account_username &&
              formik.touched.smtp_authentication_account_username
            }
            errorMessage={formik.errors.smtp_authentication_account_username}
            handleChange={handleChange}
            required
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
              formik.errors.smtp_authentication_account_password &&
              formik.touched.smtp_authentication_account_password
            }
            errorMessage={formik.errors.smtp_authentication_account_password}
            handleChange={handleChange}
            required
          />
        </Col>
        <Col sm={8}>
          <GluuToogleRow
            label="fields.trust_host"
            name="trust_host"
            handler={(e) => {
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
            handler={(e) => {
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
            showError={formik.errors.key_store && formik.touched.key_store}
            errorMessage={formik.errors.key_store}
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
            showError={formik.errors.key_store_password && formik.touched.key_store_password}
            errorMessage={formik.errors.key_store_password}
            handleChange={handleChange}
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
            showError={formik.errors.key_store_alias && formik.touched.key_store_alias}
            errorMessage={formik.errors.key_store_alias}
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
            showError={formik.errors.signing_algorithm && formik.touched.signing_algorithm}
            errorMessage={formik.errors.signing_algorithm}
            handleChange={handleChange}
            disabled={!allowSmtpKeystoreEdit}
          />
        </Col>
      </FormGroup>
      <Row>
        {!hideTestButton && (
          <Col>
            <button
              type="button"
              className={`btn btn-primary-${selectedTheme} text-center`}
              onClick={testSmtpConfig}
            >
              {t('fields.test')}
            </button>
          </Col>
        )}
        <Col>
          {' '}
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
