import { useFormik, FormikProps } from 'formik'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { scimConfigurationValidationSchema, LOGGING_LEVELS } from '../validation'
import type {
  ScimConfigurationProps,
  RootStateWithScim,
  ScimFormValues,
  ScimConfigPatchRequest,
} from './types'

const ScimConfiguration: React.FC<ScimConfigurationProps> = ({ handleSubmit }) => {
  const scimConfigs = useSelector((state: RootStateWithScim) => state.scimReducer.scim)
  const [modal, setModal] = useState<boolean>(false)

  const toggle = (): void => {
    setModal(!modal)
  }

  const formik: FormikProps<ScimFormValues> = useFormik<ScimFormValues>({
    initialValues: scimConfigs as ScimFormValues,
    validationSchema: scimConfigurationValidationSchema,
    onSubmit: () => {
      toggle()
    },
  })

  const handleCancel = () => {
    formik.resetForm()
  }

  const submitForm = (userMessage: string): void => {
    const differences: ScimConfigPatchRequest[] = []
    const { action_message, ...formValues } = formik.values
    for (const key in formValues) {
      const typedKey = key as keyof typeof formValues
      if (Object.prototype.hasOwnProperty.call(scimConfigs, key)) {
        if (scimConfigs[typedKey as keyof typeof scimConfigs] !== formValues[typedKey]) {
          differences.push({
            op: 'replace',
            path: `/${key}`,
            value: formValues[typedKey],
          })
        }
      } else if (formValues[typedKey]) {
        differences.push({
          op: 'add',
          path: `/${key}`,
          value: formValues[typedKey],
        })
      }
    }

    toggle()

    if (differences.length > 0) {
      handleSubmit(differences, userMessage)
    }
  }

  const handleToggleChange =
    (fieldName: keyof ScimFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      formik.setFieldValue(fieldName, e.target.checked)
    }

  return (
    <Form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
      className="mt-4"
    >
      <FormGroup row>
        <Col sm={12}>
          <GluuInputRow
            label="fields.base_dn"
            name="baseDN"
            value={formik.values.baseDN || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={!!(formik.errors.baseDN && formik.touched.baseDN)}
            errorMessage={formik.errors.baseDN as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.application_url"
            name="applicationUrl"
            value={formik.values.applicationUrl || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={!!(formik.errors.applicationUrl && formik.touched.applicationUrl)}
            errorMessage={formik.errors.applicationUrl as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.base_endpoint"
            name="baseEndpoint"
            value={formik.values.baseEndpoint || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={!!(formik.errors.baseEndpoint && formik.touched.baseEndpoint)}
            errorMessage={formik.errors.baseEndpoint as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.person_custom_object_class"
            name="personCustomObjectClass"
            value={formik.values.personCustomObjectClass || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              !!(formik.errors.personCustomObjectClass && formik.touched.personCustomObjectClass)
            }
            errorMessage={formik.errors.personCustomObjectClass as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.ox_auth_issuer"
            name="oxAuthIssuer"
            value={formik.values.oxAuthIssuer || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={!!(formik.errors.oxAuthIssuer && formik.touched.oxAuthIssuer)}
            errorMessage={formik.errors.oxAuthIssuer as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.max_count"
            name="maxCount"
            type="number"
            value={formik.values.maxCount?.toString() || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={!!(formik.errors.maxCount && formik.touched.maxCount)}
            errorMessage={formik.errors.maxCount as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.bulk_max_operations"
            name="bulkMaxOperations"
            type="number"
            value={formik.values.bulkMaxOperations?.toString() || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={!!(formik.errors.bulkMaxOperations && formik.touched.bulkMaxOperations)}
            errorMessage={formik.errors.bulkMaxOperations as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.bulk_max_payload_size"
            name="bulkMaxPayloadSize"
            type="number"
            value={formik.values.bulkMaxPayloadSize?.toString() || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={!!(formik.errors.bulkMaxPayloadSize && formik.touched.bulkMaxPayloadSize)}
            errorMessage={formik.errors.bulkMaxPayloadSize as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.user_extension_schema_uri"
            name="userExtensionSchemaURI"
            value={formik.values.userExtensionSchemaURI || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              !!(formik.errors.userExtensionSchemaURI && formik.touched.userExtensionSchemaURI)
            }
            errorMessage={formik.errors.userExtensionSchemaURI as string}
          />
        </Col>
        <Col sm={12}>
          <GluuSelectRow
            label="fields.logging_level"
            name="loggingLevel"
            value={formik.values.loggingLevel}
            values={LOGGING_LEVELS}
            formik={formik}
            lsize={3}
            rsize={9}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.logging_layout"
            name="loggingLayout"
            value={formik.values.loggingLayout || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={!!(formik.errors.loggingLayout && formik.touched.loggingLayout)}
            errorMessage={formik.errors.loggingLayout as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.external_logger_configuration"
            name="externalLoggerConfiguration"
            value={formik.values.externalLoggerConfiguration || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              !!(
                formik.errors.externalLoggerConfiguration &&
                formik.touched.externalLoggerConfiguration
              )
            }
            errorMessage={formik.errors.externalLoggerConfiguration as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.metric_reporter_interval"
            name="metricReporterInterval"
            type="number"
            value={formik.values.metricReporterInterval?.toString() || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              !!(formik.errors.metricReporterInterval && formik.touched.metricReporterInterval)
            }
            errorMessage={formik.errors.metricReporterInterval as string}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.metric_reporter_keep_data_days"
            name="metricReporterKeepDataDays"
            type="number"
            value={formik.values.metricReporterKeepDataDays?.toString() || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              !!(
                formik.errors.metricReporterKeepDataDays &&
                formik.touched.metricReporterKeepDataDays
              )
            }
            errorMessage={formik.errors.metricReporterKeepDataDays as string}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label="fields.metric_reporter_enabled"
            name="metricReporterEnabled"
            handler={handleToggleChange('metricReporterEnabled')}
            lsize={3}
            rsize={9}
            value={formik.values.metricReporterEnabled}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label="fields.disable_jdk_logger"
            name="disableJdkLogger"
            handler={handleToggleChange('disableJdkLogger')}
            lsize={3}
            rsize={9}
            value={formik.values.disableJdkLogger}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label="fields.use_local_cache"
            name="useLocalCache"
            handler={handleToggleChange('useLocalCache')}
            lsize={3}
            rsize={9}
            value={formik.values.useLocalCache}
          />
        </Col>
      </FormGroup>

      <Row>
        <Col>
          <GluuCommitFooter
            saveHandler={toggle}
            hideButtons={{ save: true, back: true }}
            extraLabel="Cancel"
            extraOnClick={handleCancel}
            type="submit"
          />
        </Col>
      </Row>
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        feature={adminUiFeatures.scim_configuration_edit}
        formik={formik}
      />
    </Form>
  )
}

export default ScimConfiguration
