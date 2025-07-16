import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

// Define the SCIM configuration data structure
interface ScimConfig {
  baseDN?: string
  applicationUrl?: string
  baseEndpoint?: string
  personCustomObjectClass?: string
  oxAuthIssuer?: string
  maxCount?: number
  bulkMaxOperations?: number
  bulkMaxPayloadSize?: number
  userExtensionSchemaURI?: string
  loggingLevel?: string
  loggingLayout?: string
  externalLoggerConfiguration?: string
  metricReporterInterval?: number
  metricReporterKeepDataDays?: number
  metricReporterEnabled?: boolean
  disableJdkLogger?: boolean
  useLocalCache?: boolean
  action_message?: string
  [key: string]: any
}

// Define the Redux state structure
interface ScimState {
  scim: ScimConfig
  loading: boolean
}

interface RootState {
  scimReducer: ScimState
}

// Define the component props interface
interface ScimConfigurationProps {
  handleSubmit: (differences: any[], userMessage: string) => void
}

// Define the patch operation interface
interface PatchOperation {
  op: 'replace' | 'add' | 'remove'
  path: string
  value: any
}

const ScimConfiguration: React.FC<ScimConfigurationProps> = ({ handleSubmit }) => {
  const scimConfigs = useSelector((state: RootState) => state.scimReducer.scim)
  const [modal, setModal] = useState<boolean>(false)
  const toggle = () => {
    setModal(!modal)
  }

  const formik = useFormik({
    initialValues: scimConfigs,
    onSubmit: () => {
      toggle()
    },
  })

  const submitForm = (userMessage: string) => {
    const differences: PatchOperation[] = []
    delete formik.values?.action_message

    for (const key in formik.values) {
      if (scimConfigs.hasOwnProperty(key)) {
        if (scimConfigs[key] !== formik.values[key]) {
          differences.push({
            op: 'replace',
            path: `/${key}`,
            value: formik.values[key],
          })
        }
      } else if (formik.values[key]) {
        differences.push({
          op: 'add',
          path: `/${key}`,
          value: formik.values[key],
        })
      }
    }

    toggle()

    differences.length && handleSubmit(differences, userMessage)
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
        <Col sm={12}>
          <GluuInputRow
            label="fields.base_dn"
            name="baseDN"
            value={formik.values.baseDN || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.errors.baseDN && formik.touched.baseDN}
            errorMessage={formik.errors.baseDN}
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
            showError={formik.errors.applicationUrl && formik.touched.applicationUrl}
            errorMessage={formik.errors.applicationUrl}
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
            showError={formik.errors.baseEndpoint && formik.touched.baseEndpoint}
            errorMessage={formik.errors.baseEndpoint}
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
              formik.errors.personCustomObjectClass && formik.touched.personCustomObjectClass
            }
            errorMessage={formik.errors.personCustomObjectClass}
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
            showError={formik.errors.oxAuthIssuer && formik.touched.oxAuthIssuer}
            errorMessage={formik.errors.oxAuthIssuer}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.max_count"
            name="maxCount"
            type="number"
            value={formik.values.maxCount || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.errors.maxCount && formik.touched.maxCount}
            errorMessage={formik.errors.maxCount}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.bulk_max_operations"
            name="bulkMaxOperations"
            type="number"
            value={formik.values.bulkMaxOperations || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.errors.bulkMaxOperations && formik.touched.bulkMaxOperations}
            errorMessage={formik.errors.bulkMaxOperations}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.bulk_max_payload_size"
            name="bulkMaxPayloadSize"
            type="number"
            value={formik.values.bulkMaxPayloadSize || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.errors.bulkMaxPayloadSize && formik.touched.bulkMaxPayloadSize}
            errorMessage={formik.errors.bulkMaxPayloadSize}
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
              formik.errors.userExtensionSchemaURI && formik.touched.userExtensionSchemaURI
            }
            errorMessage={formik.errors.userExtensionSchemaURI}
          />
        </Col>
        <Col sm={12}>
          <GluuSelectRow
            label="fields.logging_level"
            name="loggingLevel"
            value={formik.values.loggingLevel}
            values={['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF']}
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
            showError={formik.errors.loggingLayout && formik.touched.loggingLayout}
            errorMessage={formik.errors.loggingLayout}
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
              formik.errors.externalLoggerConfiguration &&
              formik.touched.externalLoggerConfiguration
            }
            errorMessage={formik.errors.externalLoggerConfiguration}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.metric_reporter_interval"
            name="metricReporterInterval"
            type="number"
            value={formik.values.metricReporterInterval || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              formik.errors.metricReporterInterval && formik.touched.metricReporterInterval
            }
            errorMessage={formik.errors.metricReporterInterval}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label="fields.metric_reporter_keep_data_days"
            name="metricReporterKeepDataDays"
            type="number"
            value={formik.values.metricReporterKeepDataDays || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              formik.errors.metricReporterKeepDataDays && formik.touched.metricReporterKeepDataDays
            }
            errorMessage={formik.errors.metricReporterKeepDataDays}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label="fields.metric_reporter_enabled"
            name="metricReporterEnabled"
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              formik.setFieldValue('metricReporterEnabled', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.metricReporterEnabled}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label="fields.disable_jdk_logger"
            name="disableJdkLogger"
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              formik.setFieldValue('disableJdkLogger', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.disableJdkLogger}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label="fields.use_local_cache"
            name="useLocalCache"
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              formik.setFieldValue('useLocalCache', e.target.checked)
            }}
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
            hideButtons={{ save: true, back: false }}
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
