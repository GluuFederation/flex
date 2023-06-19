import React, { useState } from 'react'
import { Row, Col, Form, FormGroup } from '../../../../app/components'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import {
  dynamicConfigInitValues,
  dynamicConfigValidationSchema,
} from '../../domain/use-cases/dynamicConfigUseCases'

function DynamicConfiguration({ fidoConfiguration, handleSubmit }) {
  const staticConfiguration = fidoConfiguration.fido
  const [modal, setModal] = useState<boolean>(false)
  const toggle = () => {
    setModal(!modal)
  }

  const formik = useFormik({
    initialValues: dynamicConfigInitValues(staticConfiguration),
    onSubmit: () => {
      toggle()
    },
    validationSchema: dynamicConfigValidationSchema
  })

  const submitForm = () => {
    toggle()
    handleSubmit(formik.values)
  }

  return (
    <Form
      onSubmit={(e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
      className='mt-3'
    >
      <FormGroup row>
        <Col sm={8}>
          <GluuInputRow
            label='fields.issuer'
            name='issuer'
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
            label='fields.base_endpoint'
            name='baseEndpoint'
            value={formik.values.baseEndpoint || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.baseEndpoint && formik.touched.baseEndpoint
            }
            errorMessage={formik.errors.baseEndpoint}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label='fields.clean_service_interval'
            name='cleanServiceInterval'
            value={formik.values.cleanServiceInterval || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.cleanServiceInterval &&
              formik.touched.cleanServiceInterval
            }
            errorMessage={formik.errors.cleanServiceInterval}
            type='number'
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label='fields.clean_service_batch_chunk'
            name='cleanServiceBatchChunkSize'
            value={formik.values.cleanServiceBatchChunkSize || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.cleanServiceBatchChunkSize &&
              formik.touched.cleanServiceBatchChunkSize
            }
            errorMessage={formik.errors.cleanServiceBatchChunkSize}
            type='number'
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label='fields.use_local_cache'
            name='useLocalCache'
            value={formik.values.useLocalCache}
            defaultValue={formik.values.useLocalCache}
            values={['true', 'false']}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.useLocalCache && formik.touched.useLocalCache
            }
            errorMessage={formik.errors.useLocalCache}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label='fields.disable_jdk_logger'
            name='disableJdkLogger'
            value={formik.values.disableJdkLogger}
            defaultValue={formik.values.disableJdkLogger}
            values={['true', 'false']}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.disableJdkLogger && formik.touched.disableJdkLogger
            }
            errorMessage={formik.errors.disableJdkLogger}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label='fields.logging_level'
            name='loggingLevel'
            value={formik.values.loggingLevel || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.loggingLevel && formik.touched.loggingLevel
            }
            errorMessage={formik.errors.loggingLevel}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label='fields.logging_layout'
            name='loggingLayout'
            value={formik.values.loggingLayout || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.loggingLayout && formik.touched.loggingLayout
            }
            errorMessage={formik.errors.loggingLayout}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label='fields.external_logger_configuration'
            name='externalLoggerConfiguration'
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
            label='fields.metric_reporter_interval'
            name='metricReporterInterval'
            type='number'
            value={formik.values.metricReporterInterval || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.metricReporterInterval &&
              formik.touched.metricReporterInterval
            }
            errorMessage={formik.errors.metricReporterInterval}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label='fields.metric_reporter_keep_data_days'
            name='metricReporterKeepDataDays'
            type='number'
            value={formik.values.metricReporterKeepDataDays || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.metricReporterKeepDataDays &&
              formik.touched.metricReporterKeepDataDays
            }
            errorMessage={formik.errors.metricReporterKeepDataDays}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label='fields.metric_reporter_enabled'
            name='metricReporterEnabled'
            value={formik.values.metricReporterEnabled}
            defaultValue={formik.values.metricReporterEnabled}
            values={['true', 'false']}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.metricReporterEnabled &&
              formik.touched.metricReporterEnabled
            }
            errorMessage={formik.errors.metricReporterEnabled}
          />
        </Col>

        <Col sm={8}>
          <Row>
            <GluuLabel label='fields.person_custom_object_classes' size={4} />
            <Col sm={8}>
              <GluuProperties
                compName='personCustomObjectClassList'
                isInputLables={true}
                formik={formik}
                options={
                  formik?.values?.personCustomObjectClassList
                    ? formik?.values?.personCustomObjectClassList.map(
                        (item) => ({ key: '', value: item })
                      )
                    : []
                }
                isKeys={false}
                buttonText='actions.add_classes'
              ></GluuProperties>
            </Col>
          </Row>
        </Col>
        <Col sm={8} className='mt-2'>
          <GluuSelectRow
            label='fields.enable_super_gluu'
            name='superGluuEnabled'
            value={formik.values.superGluuEnabled}
            defaultValue={formik.values.superGluuEnabled}
            values={['true', 'false']}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              formik.errors.superGluuEnabled && formik.touched.superGluuEnabled
            }
            errorMessage={formik.errors.superGluuEnabled}
          />
        </Col>
      </FormGroup>
      <Row>
        <Col>
          <GluuCommitFooter
            saveHandler={toggle}
            hideButtons={{ save: true, back: false }}
            type='submit'
          />
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
export default DynamicConfiguration
