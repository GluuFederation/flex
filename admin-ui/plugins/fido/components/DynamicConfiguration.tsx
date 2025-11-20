import React, { useState, useCallback, useMemo } from 'react'
import { useFormik } from 'formik'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import { fidoConstants, validationSchema, transformToFormValues } from '../helper'
import { DynamicConfigurationProps, DynamicConfigFormValues } from '../types/fido'

const DynamicConfiguration: React.FC<DynamicConfigurationProps> = ({
  fidoConfiguration,
  handleSubmit,
  isSubmitting,
  readOnly,
}) => {
  const [modal, setModal] = useState(false)

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const formik = useFormik<DynamicConfigFormValues>({
    initialValues: transformToFormValues(
      fidoConfiguration,
      fidoConstants.DYNAMIC,
    ) as DynamicConfigFormValues,
    onSubmit: readOnly ? () => undefined : toggle,
    validationSchema: validationSchema[fidoConstants.VALIDATION_SCHEMAS.DYNAMIC_CONFIG],
    enableReinitialize: true,
    validateOnMount: true,
  })

  const submitForm = useCallback(
    (userMessage: string) => {
      if (readOnly) {
        return
      }
      toggle()
      handleSubmit(formik.values, userMessage)
    },
    [handleSubmit, toggle, formik.values, readOnly],
  )

  const handleCancel = useCallback(() => {
    const initialValues = transformToFormValues(
      fidoConfiguration,
      fidoConstants.DYNAMIC,
    ) as DynamicConfigFormValues
    formik.resetForm({ values: initialValues })
  }, [formik, fidoConfiguration])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (readOnly) {
        return
      }
      formik.handleSubmit()
    },
    [formik, readOnly],
  )

  const personCustomObjectClassOptions = useMemo(() => {
    return (formik.values.personCustomObjectClassList || []).map((item) => ({
      key: '',
      value: item,
    }))
  }, [formik.values.personCustomObjectClassList])

  return (
    <Form onSubmit={handleFormSubmit} className="mt-3">
      <FormGroup row>
        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.ISSUER}
            name={fidoConstants.FORM_FIELDS.ISSUER}
            value={formik.values.issuer || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            required
            showError={!!(formik.errors.issuer && formik.touched.issuer)}
            errorMessage={formik.errors.issuer}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.BASE_ENDPOINT}
            name={fidoConstants.FORM_FIELDS.BASE_ENDPOINT}
            value={formik.values.baseEndpoint || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            required
            showError={!!(formik.errors.baseEndpoint && formik.touched.baseEndpoint)}
            errorMessage={formik.errors.baseEndpoint}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.CLEAN_SERVICE_INTERVAL}
            name={fidoConstants.FORM_FIELDS.CLEAN_SERVICE_INTERVAL}
            value={formik.values.cleanServiceInterval ?? ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              !!(formik.errors.cleanServiceInterval && formik.touched.cleanServiceInterval)
            }
            errorMessage={formik.errors.cleanServiceInterval}
            type="number"
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.CLEAN_SERVICE_BATCH_CHUNK}
            name={fidoConstants.FORM_FIELDS.CLEAN_SERVICE_BATCH_CHUNK_SIZE}
            value={formik.values.cleanServiceBatchChunkSize ?? ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              !!(
                formik.errors.cleanServiceBatchChunkSize &&
                formik.touched.cleanServiceBatchChunkSize
              )
            }
            errorMessage={formik.errors.cleanServiceBatchChunkSize}
            type="number"
          />
        </Col>

        <Col sm={8}>
          <GluuToggleRow
            label={fidoConstants.LABELS.USE_LOCAL_CACHE}
            name={fidoConstants.FORM_FIELDS.USE_LOCAL_CACHE}
            formik={formik}
            lsize={4}
            rsize={8}
            doc_category={fidoConstants.DOC_CATEGORY}
          />
        </Col>

        <Col sm={8}>
          <GluuToggleRow
            label={fidoConstants.LABELS.DISABLE_JDK_LOGGER}
            name={fidoConstants.FORM_FIELDS.DISABLE_JDK_LOGGER}
            formik={formik}
            lsize={4}
            rsize={8}
            doc_category={fidoConstants.DOC_CATEGORY}
          />
        </Col>

        <Col sm={8}>
          <GluuSelectRow
            label={fidoConstants.LABELS.LOGGING_LEVEL}
            name={fidoConstants.FORM_FIELDS.LOGGING_LEVEL}
            value={formik.values.loggingLevel}
            values={[...fidoConstants.LOGGING_LEVELS]}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={!!(formik.errors.loggingLevel && formik.touched.loggingLevel)}
            errorMessage={formik.errors.loggingLevel}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.LOGGING_LAYOUT}
            name={fidoConstants.FORM_FIELDS.LOGGING_LAYOUT}
            value={formik.values.loggingLayout || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={!!(formik.errors.loggingLayout && formik.touched.loggingLayout)}
            errorMessage={formik.errors.loggingLayout}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.METRIC_REPORTER_INTERVAL}
            name={fidoConstants.FORM_FIELDS.METRIC_REPORTER_INTERVAL}
            type="number"
            value={formik.values.metricReporterInterval ?? ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              !!(formik.errors.metricReporterInterval && formik.touched.metricReporterInterval)
            }
            errorMessage={formik.errors.metricReporterInterval}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.METRIC_REPORTER_KEEP_DATA_DAYS}
            name={fidoConstants.FORM_FIELDS.METRIC_REPORTER_KEEP_DATA_DAYS}
            type="number"
            value={formik.values.metricReporterKeepDataDays ?? ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              !!(
                formik.errors.metricReporterKeepDataDays &&
                formik.touched.metricReporterKeepDataDays
              )
            }
            errorMessage={formik.errors.metricReporterKeepDataDays}
          />
        </Col>

        <Col sm={8}>
          <GluuToggleRow
            label={fidoConstants.LABELS.METRIC_REPORTER_ENABLED}
            name={fidoConstants.FORM_FIELDS.METRIC_REPORTER_ENABLED}
            formik={formik}
            lsize={4}
            rsize={8}
            doc_category={fidoConstants.DOC_CATEGORY}
          />
        </Col>

        <Col sm={8}>
          <Row>
            <GluuLabel label={fidoConstants.LABELS.PERSON_CUSTOM_OBJECT_CLASSES} size={4} />
            <Col sm={8}>
              <GluuProperties
                compName={fidoConstants.FORM_FIELDS.PERSON_CUSTOM_OBJECT_CLASS_LIST}
                isInputLables={true}
                formik={formik}
                options={personCustomObjectClassOptions}
                isKeys={false}
                buttonText={fidoConstants.BUTTON_TEXT.ADD_CLASSES}
              />
            </Col>
          </Row>
        </Col>

        <Col sm={8}>
          <GluuToggleRow
            label={fidoConstants.LABELS.FIDO2_METRICS_ENABLED}
            name={fidoConstants.FORM_FIELDS.FIDO2_METRICS_ENABLED}
            formik={formik}
            lsize={4}
            rsize={8}
            doc_category={fidoConstants.DOC_CATEGORY}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.FIDO2_METRICS_RETENTION_DAYS}
            name={fidoConstants.FORM_FIELDS.FIDO2_METRICS_RETENTION_DAYS}
            type="number"
            value={formik.values.fido2MetricsRetentionDays ?? ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              !!(
                formik.errors.fido2MetricsRetentionDays && formik.touched.fido2MetricsRetentionDays
              )
            }
            errorMessage={formik.errors.fido2MetricsRetentionDays}
          />
        </Col>

        <Col sm={8}>
          <GluuToggleRow
            label={fidoConstants.LABELS.FIDO2_DEVICE_INFO_COLLECTION}
            name={fidoConstants.FORM_FIELDS.FIDO2_DEVICE_INFO_COLLECTION}
            formik={formik}
            lsize={4}
            rsize={8}
            doc_category={fidoConstants.DOC_CATEGORY}
          />
        </Col>

        <Col sm={8}>
          <GluuToggleRow
            label={fidoConstants.LABELS.FIDO2_ERROR_CATEGORIZATION}
            name={fidoConstants.FORM_FIELDS.FIDO2_ERROR_CATEGORIZATION}
            formik={formik}
            lsize={4}
            rsize={8}
            doc_category={fidoConstants.DOC_CATEGORY}
          />
        </Col>

        <Col sm={8}>
          <GluuToggleRow
            label={fidoConstants.LABELS.FIDO2_PERFORMANCE_METRICS}
            name={fidoConstants.FORM_FIELDS.FIDO2_PERFORMANCE_METRICS}
            formik={formik}
            lsize={4}
            rsize={8}
            doc_category={fidoConstants.DOC_CATEGORY}
          />
        </Col>
      </FormGroup>
      <Row>
        <Col>
          <GluuFormFooter
            showBack={true}
            showCancel={true}
            showApply={!readOnly}
            onApply={toggle}
            onCancel={handleCancel}
            disableBack={false}
            disableCancel={!formik.dirty}
            disableApply={!formik.isValid || !formik.dirty}
            applyButtonType="button"
            isLoading={isSubmitting ?? false}
          />
        </Col>
      </Row>
      {!readOnly && (
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} formik={formik} />
      )}
    </Form>
  )
}

export default React.memo(DynamicConfiguration)
