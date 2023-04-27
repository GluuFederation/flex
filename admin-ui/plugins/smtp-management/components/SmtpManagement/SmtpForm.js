import React, { useState, useContext } from 'react'
import { Button, Row, Col, Form, FormGroup } from '../../../../app/components'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'
import { testSmtp } from '../../redux/actions/SmtpActions'
import { useDispatch, useSelector } from 'react-redux'

function SmtpForm({ item, handleSubmit }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const testStatus = useSelector((state) => state.smtpsReducer.testStatus);
  console.log(testStatus);

  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const initialValues = {
    host: item?.host || "",
    port: item?.port || "",
    connect_protection: item?.connect_protection || "",
    from_name: item?.from_name || "",
    from_email_address: item?.from_email_address || "",
    requires_authentication: item?.requires_authentication || "false",
    smtp_authentication_account_username: item?.smtp_authentication_account_username || "",
    smtp_authentication_account_password: item?.smtp_authentication_account_password || "",
    trust_host: item?.trust_host || "false",
    key_store: item?.key_store || "",
    key_store_password: item?.key_store_password || "",
    key_store_alias: item?.key_store_alias || "",
    signing_algorithm: item?.signing_algorithm || "",
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      toggle()
    },
    validationSchema: Yup.object(
      {
        host: Yup.string().required('Host name is required.'),
        port: Yup.number().required('Port number is required.'),
        connect_protection: Yup.string().required('Connection Protection is required.'),
        from_name: Yup.string().required('From name is required.'),
        from_email_address: Yup.string().required('From email address is required.'),
        requires_authentication: Yup.string().required('Authentication is required.'),
        smtp_authentication_account_username: Yup.string().required('SMTP user name is required.'),
        smtp_authentication_account_password: Yup.string().required('SMTP user password is required.'),
        trust_host: Yup.string().required('Trust host is required.'),
        key_store: Yup.string().required('Key Store is required.'),
        key_store_password: Yup.string().required('Key Store password is required.'),
        key_store_alias: Yup.string().required('Key Store alias is required.'),
        signing_algorithm: Yup.string().required('Key Store Siging Alg is required.'),
      }
    ),
    setFieldValue: (field) => {
      delete values[field]
    },
  })

  const submitForm = () => {
    toggle()
    handleSubmit(formik.values)
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
          />
        </Col>
        <Col sm={8}>
          <GluuSelectRow
            label="fields.connect_protection"
            name="connect_protection"
            value={formik.values.connect_protection || ''}
            defaultValue={formik.values.connect_protection || ''}
            values={["None", "StartTls", "SslTls"]}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.errors.connect_protection && formik.touched.connect_protection}
            errorMessage={formik.errors.connect_protection}
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
          />
        </Col>

        <Col sm={8}>

          <GluuSelectRow
            label="fields.requires_authentication"
            name="requires_authentication"
            value={formik.values.requires_authentication || ''}
            defaultValue={formik.values.requires_authentication || ''}
            values={["false", "true"]}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.errors.requires_authentication && formik.touched.requires_authentication}
            errorMessage={formik.errors.requires_authentication}
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
            showError={formik.errors.smtp_authentication_account_username && formik.touched.smtp_authentication_account_username}
            errorMessage={formik.errors.smtp_authentication_account_username}
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
            showError={formik.errors.smtp_authentication_account_password && formik.touched.smtp_authentication_account_password}
            errorMessage={formik.errors.smtp_authentication_account_password}
          />
        </Col>

        <Col sm={8}>

          <GluuSelectRow
            label="fields.trust_host"
            name="trust_host"
            value={formik.values.trust_host || ''}
            defaultValue={formik.values.trust_host || ''}
            values={["false", "true"]}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.errors.trust_host && formik.touched.trust_host}
            errorMessage={formik.errors.trust_host}
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
          />
        </Col>
      </FormGroup>
      <Row>
        <Col>
          <button
            type="button"
            className={`btn btn-primary-${selectedTheme} text-center`}
            onClick={() => {
              dispatch(testSmtp())
            }}
          >
            {t('fields.test')}
          </button>
        </Col>
        <Col> <GluuCommitFooter saveHandler={toggle} hideButtons={{ save: true, back: true }} type="submit" />
        </Col>
      </Row>
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
      />
    </Form>
  )
}
export default SmtpForm