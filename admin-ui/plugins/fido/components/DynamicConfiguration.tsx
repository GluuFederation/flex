import React, { useState, useCallback, useMemo } from 'react'
import { useFormik } from 'formik'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import { fidoConstants, validationSchema } from '../helper'
import { transformToFormValues, getAvailableHintOptions, getEmptyDropdownMessage } from '../helper'
import type {
  DynamicConfigurationProps,
  DynamicConfigFormValues,
  DynamicConfigFormik,
  DropdownOption,
  FormData,
} from './types/DynamicConfiguration'

function DynamicConfiguration({
  fidoConfiguration,
  handleSubmit,
}: DynamicConfigurationProps): JSX.Element {
  const { fido } = fidoConfiguration

  const [modal, setModal] = useState<boolean>(false)

  const toggle = useCallback((): void => {
    setModal((prev) => !prev)
  }, [])

  const formik: DynamicConfigFormik = useFormik<DynamicConfigFormValues>({
    initialValues: transformToFormValues(fido, fidoConstants.DYNAMIC) as DynamicConfigFormValues,
    onSubmit: toggle,
    validationSchema: validationSchema.dynamicConfigValidationSchema,
  })

  const submitForm = useCallback((): void => {
    toggle()
    handleSubmit(formik.values as unknown as FormData)
  }, [handleSubmit, toggle, formik.values])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault()
      formik.handleSubmit()
    },
    [formik],
  )

  const availableHintOptions = useMemo((): string[] => {
    return getAvailableHintOptions(formik.values.hints)
  }, [formik.values.hints])

  const emptyDropdownMessage = useMemo((): string => {
    return getEmptyDropdownMessage(formik.values.hints)
  }, [formik.values.hints])

  const personCustomObjectClassOptions = useMemo((): DropdownOption[] => {
    return formik?.values?.personCustomObjectClassList
      ? formik.values.personCustomObjectClassList.map(
          (item: string): DropdownOption => ({
            key: '',
            value: item,
          }),
        )
      : []
  }, [formik?.values?.personCustomObjectClassList])

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
            showError={formik.errors.issuer && formik.touched.issuer}
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
            showError={formik.errors.baseEndpoint && formik.touched.baseEndpoint}
            errorMessage={formik.errors.baseEndpoint}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.CLEAN_SERVICE_INTERVAL}
            name={fidoConstants.FORM_FIELDS.CLEAN_SERVICE_INTERVAL}
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
            label={fidoConstants.LABELS.CLEAN_SERVICE_BATCH_CHUNK}
            name={fidoConstants.FORM_FIELDS.CLEAN_SERVICE_BATCH_CHUNK_SIZE}
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
            values={fidoConstants.LOGGING_LEVELS}
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
            showError={formik.errors.loggingLayout && formik.touched.loggingLayout}
            errorMessage={formik.errors.loggingLayout}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.EXTERNAL_LOGGER_CONFIGURATION}
            name={fidoConstants.FORM_FIELDS.EXTERNAL_LOGGER_CONFIGURATION}
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
            label={fidoConstants.LABELS.METRIC_REPORTER_INTERVAL}
            name={fidoConstants.FORM_FIELDS.METRIC_REPORTER_INTERVAL}
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
            label={fidoConstants.LABELS.METRIC_REPORTER_KEEP_DATA_DAYS}
            name={fidoConstants.FORM_FIELDS.METRIC_REPORTER_KEEP_DATA_DAYS}
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
          <GluuTypeAhead
            name={fidoConstants.FORM_FIELDS.HINTS}
            label={fidoConstants.LABELS.HINTS}
            formik={formik}
            value={formik.values.hints || []}
            options={availableHintOptions}
            lsize={4}
            rsize={8}
            showError={formik.errors.hints && formik.touched.hints}
            errorMessage={formik.errors.hints}
            doc_category={fidoConstants.DOC_CATEGORY}
            emptyLabel={emptyDropdownMessage}
            allowNew={false}
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

export default React.memo(DynamicConfiguration)
