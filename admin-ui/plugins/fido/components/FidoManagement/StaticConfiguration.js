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
import { useDispatch, useSelector } from 'react-redux'

function StaticConfiguration({ item, handleSubmit }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }
  const initialValues = {}
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      toggle()
    },
    validationSchema: Yup.object({}),
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
      className="mt-4"
    >
      <FormGroup row>
        <Col sm={8}>
          <GluuInputRow
            label="fields.issuer"
            name="host"
            value={formik.values.host || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.host && formik.touched.host}
            errorMessage={formik.errors.host}
          />
        </Col>


        <Col sm={8}>
          <GluuInputRow
            label="fields.base_endpoint"
            name="host"
            value={formik.values.host || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.host && formik.touched.host}
            errorMessage={formik.errors.host}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.clean_service_interval"
            name="host"
            value={formik.values.host || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.host && formik.touched.host}
            errorMessage={formik.errors.host}
            type="number"
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.clean_service_batch_chunk"
            name="host"
            value={formik.values.host || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.host && formik.touched.host}
            errorMessage={formik.errors.host}
            type="number"
          />
        </Col>


        <Col sm={8}>
          <GluuSelectRow
            label="fields.use_local_cache"
            name="connect_protection"
            value={formik.values.connect_protection || ''}
            defaultValue={formik.values.connect_protection || ''}
            values={["true", "false"]}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.connect_protection && formik.touched.connect_protection}
            errorMessage={formik.errors.connect_protection}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label="fields.disable_jdk_logger"
            name="connect_protection"
            value={formik.values.connect_protection || ''}
            defaultValue={formik.values.connect_protection || ''}
            values={["true", "false"]}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.connect_protection && formik.touched.connect_protection}
            errorMessage={formik.errors.connect_protection}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.logging_level"
            name="host"
            value={formik.values.host || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.host && formik.touched.host}
            errorMessage={formik.errors.host}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.logging_layout"
            name="host"
            value={formik.values.host || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.host && formik.touched.host}
            errorMessage={formik.errors.host}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.external_logger_configuration"
            name="host"
            value={formik.values.host || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.host && formik.touched.host}
            errorMessage={formik.errors.host}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.metric_reporter_interval"
            name="host"
            value={formik.values.host || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.host && formik.touched.host}
            errorMessage={formik.errors.host}
          />

          <GluuSelectRow
            label="fields.metric_reporter_interval"
            name="connect_protection"
            value={formik.values.connect_protection || ''}
            defaultValue={formik.values.connect_protection || ''}
            values={["true", "false"]}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.connect_protection && formik.touched.connect_protection}
            errorMessage={formik.errors.connect_protection}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.metric_reporter_keep_data_days"
            name="host"
            value={formik.values.host || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.host && formik.touched.host}
            errorMessage={formik.errors.host}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label="fields.metric_reporter_enabled"
            name="connect_protection"
            value={formik.values.connect_protection || ''}
            defaultValue={formik.values.connect_protection || ''}
            values={["true", "false"]}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.connect_protection && formik.touched.connect_protection}
            errorMessage={formik.errors.connect_protection}
          />
        </Col>
        <Col sm={8}>
          <GluuSelectRow
            label="fields.person_custom_object_classes"
            name="connect_protection"
            value={formik.values.connect_protection || ''}
            defaultValue={formik.values.connect_protection || ''}
            values={["jansCustomPerson", "jansPerson"]}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.connect_protection && formik.touched.connect_protection}
            errorMessage={formik.errors.connect_protection}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label="fields.enable_super_gluu"
            name="connect_protection"
            value={formik.values.connect_protection || ''}
            defaultValue={formik.values.connect_protection || ''}
            values={["true", "false"]}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.connect_protection && formik.touched.connect_protection}
            errorMessage={formik.errors.connect_protection}
          />
        </Col>
      </FormGroup>
      <Row>
        <Col> <GluuCommitFooter saveHandler={toggle} hideButtons={{ save: true, back: false }} type="submit" />
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
export default StaticConfiguration