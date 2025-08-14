import React, { useState } from 'react'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import { validationSchema } from '../helper'

// Constants for the component
const DOC_CATEGORY = 'fido'

const dynamicConfigInitValues = (dynamicConfiguration) => {
  return {
    issuer: dynamicConfiguration?.issuer || '',
    baseEndpoint: dynamicConfiguration?.baseEndpoint || '',
    cleanServiceInterval: dynamicConfiguration?.cleanServiceInterval || '',
    cleanServiceBatchChunkSize: dynamicConfiguration?.cleanServiceBatchChunkSize || '',
    useLocalCache: dynamicConfiguration?.useLocalCache || '',
    disableJdkLogger: dynamicConfiguration?.disableJdkLogger || '',
    loggingLevel: dynamicConfiguration?.loggingLevel || '',
    loggingLayout: dynamicConfiguration?.loggingLayout || '',
    externalLoggerConfiguration: dynamicConfiguration?.externalLoggerConfiguration || '',
    metricReporterEnabled: dynamicConfiguration?.metricReporterEnabled,
    metricReporterInterval: dynamicConfiguration?.metricReporterInterval || '',
    metricReporterKeepDataDays: dynamicConfiguration?.metricReporterKeepDataDays || '',
    personCustomObjectClassList: dynamicConfiguration?.personCustomObjectClassList || [],
    // superGluuEnabled: dynamicConfiguration?.superGluuEnabled,
    hints: dynamicConfiguration?.hints || dynamicConfiguration?.fido2Configuration?.hints || [],
  }
}

function DynamicConfiguration({ fidoConfiguration, handleSubmit }) {
  const { fido } = fidoConfiguration

  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const formik = useFormik({
    initialValues: dynamicConfigInitValues(fido),
    onSubmit: () => {
      toggle()
    },
    validationSchema: validationSchema.dynamicConfigValidationSchema,
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

        <Col sm={8} className="mt-4">
          <GluuTypeAhead
            name="hints"
            label="Hints"
            formik={formik}
            value={formik.values.hints || []}
            onChange={(options) => {
              // Convert objects to strings immediately
              const values =
                options?.map((item) => {
                  if (typeof item === 'string') {
                    return item
                  }
                  // Handle the object format from GluuTypeAhead
                  if (item?.hints) {
                    // Remove quotes if they exist
                    return item.hints.replace(/^"|"$/g, '')
                  }
                  return item?.value || item?.label || item
                }) || []
              formik.setFieldValue('hints', values)
            }}
            options={[]}
            doc_category={DOC_CATEGORY}
            lsize={4}
            rsize={8}
            disabled={false}
            allowNew={true}
            minLength={1}
            placeholder="Type a hint and press enter to add it..."
            hideHelperMessage={true}
            showError={formik.errors.hints && formik.touched.hints}
            errorMessage={formik.errors.hints}
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
