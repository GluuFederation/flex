import React, { useState } from 'react'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import * as Yup from 'yup'

const dynamicConfigInitValues = (staticConfiguration) => {
  return {
    issuer: staticConfiguration?.issuer || '',
    baseEndpoint: staticConfiguration?.baseEndpoint || '',
    cleanServiceInterval: staticConfiguration?.cleanServiceInterval || '',
    cleanServiceBatchChunkSize: staticConfiguration?.cleanServiceBatchChunkSize || '',
    useLocalCache: staticConfiguration?.useLocalCache || '',
    disableJdkLogger: staticConfiguration?.disableJdkLogger || '',
    loggingLevel: staticConfiguration?.loggingLevel || '',
    loggingLayout: staticConfiguration?.loggingLayout || '',
    externalLoggerConfiguration: staticConfiguration?.externalLoggerConfiguration || '',
    metricReporterEnabled: staticConfiguration?.metricReporterEnabled,
    metricReporterInterval: staticConfiguration?.metricReporterInterval || '',
    metricReporterKeepDataDays: staticConfiguration?.metricReporterKeepDataDays || '',
    personCustomObjectClassList: staticConfiguration?.personCustomObjectClassList || [],
    superGluuEnabled: staticConfiguration?.superGluuEnabled,
  }
}

const dynamicConfigValidationSchema = Yup.object({
  issuer: Yup.string().required('Issuer is required.'),
  baseEndpoint: Yup.string().required('Base Endpoint is required.'),
  cleanServiceInterval: Yup.string().required('Clean Service Interval is required.'),
  cleanServiceBatchChunkSize: Yup.string().required('Clean Service Batch Chunk Size is required.'),
  useLocalCache: Yup.boolean().required('Use Local Cache is required.'),
  disableJdkLogger: Yup.boolean().required('Disable Jdk Logger is required.'),
  loggingLevel: Yup.string().required('Logging Level is required.'),
  loggingLayout: Yup.string().required('Logging Layout is required.'),
  metricReporterEnabled: Yup.boolean().required('Metric Reporter Enabled is required.'),
  metricReporterInterval: Yup.number().required('Metric Reporter Interval is required.'),
  metricReporterKeepDataDays: Yup.number().required('Metric Reporter Keep Data Days is required.'),
  superGluuEnabled: Yup.boolean().required('Enable Super Gluu is required.'),
})

function DynamicConfiguration({ fidoConfiguration, handleSubmit }) {
  const staticConfiguration = fidoConfiguration.fido
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const formik = useFormik({
    initialValues: dynamicConfigInitValues(staticConfiguration),
    onSubmit: () => {
      toggle()
    },
    validationSchema: dynamicConfigValidationSchema,
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
      className="mt-3"
    >
      <FormGroup row>
        <Col sm={8}>
          <GluuInputRow
            label="fields.issuer"
            name="issuer"
            value={formik.values.issuer || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.issuer && formik.touched.issuer}
            errorMessage={formik.errors.issuer}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.base_endpoint"
            name="baseEndpoint"
            value={formik.values.baseEndpoint || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.baseEndpoint && formik.touched.baseEndpoint}
            errorMessage={formik.errors.baseEndpoint}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.clean_service_interval"
            name="cleanServiceInterval"
            value={formik.values.cleanServiceInterval || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.cleanServiceInterval && formik.touched.cleanServiceInterval}
            errorMessage={formik.errors.cleanServiceInterval}
            type="number"
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.clean_service_batch_chunk"
            name="cleanServiceBatchChunkSize"
            value={formik.values.cleanServiceBatchChunkSize || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.cleanServiceBatchChunkSize && formik.touched.cleanServiceBatchChunkSize
            }
            errorMessage={formik.errors.cleanServiceBatchChunkSize}
            type="number"
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label="fields.use_local_cache"
            name="useLocalCache"
            value={formik.values.useLocalCache}
            defaultValue={formik.values.useLocalCache}
            values={['true', 'false']}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.useLocalCache && formik.touched.useLocalCache}
            errorMessage={formik.errors.useLocalCache}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label="fields.disable_jdk_logger"
            name="disableJdkLogger"
            value={formik.values.disableJdkLogger}
            defaultValue={formik.values.disableJdkLogger}
            values={['true', 'false']}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.disableJdkLogger && formik.touched.disableJdkLogger}
            errorMessage={formik.errors.disableJdkLogger}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label="fields.logging_level"
            name="loggingLevel"
            value={formik.values.loggingLevel}
            defaultValue={formik.values.loggingLevel}
            values={['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF']}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.loggingLevel && formik.touched.loggingLevel}
            errorMessage={formik.errors.loggingLevel}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.logging_layout"
            name="loggingLayout"
            value={formik.values.loggingLayout || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.loggingLayout && formik.touched.loggingLayout}
            errorMessage={formik.errors.loggingLayout}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.external_logger_configuration"
            name="externalLoggerConfiguration"
            value={formik.values.externalLoggerConfiguration || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.externalLoggerConfiguration &&
              formik.touched.externalLoggerConfiguration
            }
            errorMessage={formik.errors.externalLoggerConfiguration}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.metric_reporter_interval"
            name="metricReporterInterval"
            type="number"
            value={formik.values.metricReporterInterval || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.metricReporterInterval && formik.touched.metricReporterInterval
            }
            errorMessage={formik.errors.metricReporterInterval}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label="fields.metric_reporter_keep_data_days"
            name="metricReporterKeepDataDays"
            type="number"
            value={formik.values.metricReporterKeepDataDays || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.metricReporterKeepDataDays && formik.touched.metricReporterKeepDataDays
            }
            errorMessage={formik.errors.metricReporterKeepDataDays}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label="fields.metric_reporter_enabled"
            name="metricReporterEnabled"
            value={formik.values.metricReporterEnabled}
            defaultValue={formik.values.metricReporterEnabled}
            values={['true', 'false']}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.metricReporterEnabled && formik.touched.metricReporterEnabled}
            errorMessage={formik.errors.metricReporterEnabled}
          />
        </Col>

        <Col sm={8}>
          <Row>
            <GluuLabel label="fields.person_custom_object_classes" size={4} />
            <Col sm={8}>
              <GluuProperties
                compName="personCustomObjectClassList"
                isInputLables={true}
                formik={formik}
                options={
                  formik?.values?.personCustomObjectClassList
                    ? formik?.values?.personCustomObjectClassList.map((item) => ({
                        key: '',
                        value: item,
                      }))
                    : []
                }
                isKeys={false}
                buttonText="actions.add_classes"
              ></GluuProperties>
            </Col>
          </Row>
        </Col>
        <Col sm={8} className="mt-2">
          <GluuSelectRow
            label="fields.enable_super_gluu"
            name="superGluuEnabled"
            value={formik.values.superGluuEnabled}
            defaultValue={formik.values.superGluuEnabled}
            values={['true', 'false']}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={formik.errors.superGluuEnabled && formik.touched.superGluuEnabled}
            errorMessage={formik.errors.superGluuEnabled}
          />
        </Col>
      </FormGroup>
      <Row>
        <Col>
          <GluuCommitFooter
            saveHandler={toggle}
            hideButtons={{ save: true, back: false }}
            type="submit"
          />
        </Col>
      </Row>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} formik={formik} />
    </Form>
  )
}
export default DynamicConfiguration
