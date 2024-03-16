import React, { useState } from 'react'
import { isEmpty } from 'lodash'
import { useFormik } from 'formik'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import PropTypes from 'prop-types'

const ConfigurationForm = ({
  initialValues,
  validationSchema,
  handleFormSubmission,
}) => {
  const userAction = {}
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      if (isEmpty(formik.errors)) {
        toggle()
      }
    },
  })

  const submitForm = (userMessage) => {
    toggle()
    handleFormSubmission({ userMessage, userAction, values: formik.values })
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
      className='mt-4'
    >
      <FormGroup row>
        <Col sm={12}>
          <GluuInputRow
            label='fields.name'
            name='configId'
            value={formik.values.configId}
            formik={formik}
            lsize={3}
            rsize={9}
            required
            showError={formik.errors.configId && formik.touched.configId}
            errorMessage={formik.errors.configId}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.bind_dn'
            name={`bindDN`}
            value={formik.values?.bindDN}
            formik={formik}
            lsize={3}
            rsize={9}
            required
            showError={formik.errors?.bindDN && formik.touched?.bindDN}
            errorMessage={formik.errors?.bindDN}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.bind_password'
            name={`bindPassword`}
            value={formik.values?.bindPassword}
            formik={formik}
            lsize={3}
            rsize={9}
            type='password'
            required
            showError={
              formik.errors?.bindPassword && formik.touched?.bindPassword
            }
            errorMessage={formik.errors?.bindPassword}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.max_connections'
            name={`maxConnections`}
            value={formik.values?.maxConnections}
            formik={formik}
            lsize={3}
            rsize={9}
            type='number'
            required
            showError={
              formik.errors?.maxConnections && formik.touched?.maxConnections
            }
            errorMessage={formik.errors?.maxConnections}
          />
        </Col>
        <Col sm={12}>
          <Row>
            <GluuLabel required label='fields.server_port' size={3} />
            <Col sm={9}>
              <GluuProperties
                compName={`servers`}
                isInputLables={true}
                formik={formik}
                options={
                  formik.values?.servers
                    ? formik.values?.servers.map((item) => ({
                        configKey: '',
                        value: item,
                      }))
                    : []
                }
                isKeys={false}
                buttonText='actions.add_server'
                showError={formik.errors?.servers && formik.touched?.servers}
                errorMessage={formik.errors?.servers}
              />
            </Col>
          </Row>
        </Col>
        <Col sm={12}>
          <Row className='mt-4'>
            <GluuLabel required label='fields.base_dns' size={3} />
            <Col sm={9}>
              <GluuProperties
                compName={`baseDNs`}
                isInputLables={true}
                formik={formik}
                options={
                  formik.values?.baseDNs
                    ? formik.values?.baseDNs?.map((item) => ({
                        configKey: '',
                        value: item,
                      }))
                    : []
                }
                isKeys={false}
                buttonText='actions.add_base_dn'
                showError={formik.errors?.baseDNs && formik.touched?.baseDNs}
                errorMessage={formik.errors?.baseDNs}
              />
            </Col>
          </Row>
        </Col>
        <Col sm={12} className='mt-4'>
          <GluuInputRow
            label='fields.primary_key'
            name={`primaryKey`}
            value={formik.values?.primaryKey}
            formik={formik}
            lsize={3}
            rsize={9}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.local_primary_key'
            name={`localPrimaryKey`}
            value={formik.values?.localPrimaryKey}
            formik={formik}
            lsize={3}
            rsize={9}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label='fields.use_anonymous_bind'
            name={`useAnonymousBind`}
            handler={(e) => {
              formik.setFieldValue(`useAnonymousBind`, e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.useAnonymousBind}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label='fields.use_ssl'
            name={`useSSL`}
            handler={(e) => {
              formik.setFieldValue(`useSSL`, e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.useSSL}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label='fields.enabled'
            name={`enabled`}
            handler={(e) => {
              formik.setFieldValue(`enabled`, e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.enabled}
          />
        </Col>
      </FormGroup>

      <Row>
        <Col>
          <GluuCommitFooter
            hideButtons={{ save: true, back: false }}
            type='submit'
            saveHandler={toggle}
          />
        </Col>
      </Row>
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
        feature='jans_kc_link_write'
      />
    </Form>
  )
}

export default ConfigurationForm
ConfigurationForm.propTypes = {
  validationSchema: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleFormSubmission: PropTypes.func.isRequired,
}