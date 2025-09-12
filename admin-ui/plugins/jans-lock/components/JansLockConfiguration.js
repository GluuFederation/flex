import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { buildPayload, JANS_LOCK_WRITE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import { putJansLockConfiguration } from 'Plugins/jans-lock/redux/features/JansLockSlice'

const DOC_CATEGORY = 'jans_lock'

const JansLockConfiguration = () => {
  const dispatch = useDispatch()
  const { hasCedarPermission, authorize } = useCedarling()
  const lockConfigs = useSelector((state) => state.jansLockReducer.configuration)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)
  const viewOnly = !hasCedarPermission(JANS_LOCK_WRITE)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    const authorizePermissions = async () => {
      try {
        await authorize([JANS_LOCK_WRITE])
      } catch (error) {
        console.error('Error authorizing Jans Lock permissions:', error)
      }
    }

    authorizePermissions()
  }, [])

  useEffect(() => {}, [cedarPermissions])

  const toggle = () => {
    setModal(!modal)
  }

  const formik = useFormik({
    initialValues: lockConfigs,
    onSubmit: () => {
      toggle()
    },
  })

  const submitForm = (userMessage) => {
    const differences = []
    delete formik.values?.action_message

    for (const key in formik.values) {
      if (Object.prototype.hasOwnProperty.call(lockConfigs, key)) {
        if (JSON.stringify(lockConfigs[key]) !== JSON.stringify(formik.values[key])) {
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

  const handleSubmit = (data, userMessage) => {
    const userAction = {}
    buildPayload(userAction, userMessage, {})
    userAction.action_message = userMessage
    userAction.action_data = data
    dispatch(putJansLockConfiguration({ action: userAction }))
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
        {/* <Col sm={12}>
          <GluuInputRow
            label="fields.base_dn"
            name="baseDN"
            value={formik.values.baseDN || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.errors.baseDN && formik.touched.baseDN}
            errorMessage={formik.errors.baseDN}
            disabled={viewOnly}
            doc_category={DOC_CATEGORY}
          />
        </Col> */}

        <Col sm={12}>
          <GluuTypeAhead
            name="tokenChannels"
            label="fields.token_channels"
            value={formik.values.tokenChannels}
            onChange={(options) => {
              const getLabel = (item) => item?.customOption && item?.tokenChannels
              const values = options?.map((item) =>
                typeof item == 'string' ? item : getLabel(item),
              )
              formik.setFieldValue('tokenChannels', values)
            }}
            options={lockConfigs?.tokenChannels || []}
            doc_category={DOC_CATEGORY}
            lsize={3}
            rsize={9}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={12}>
          <GluuSelectRow
            label="fields.disable_jdk_logger"
            name="disableJdkLogger"
            value={formik.values.disableJdkLogger}
            defaultValue={formik.values.disableJdkLogger}
            values={['true', 'false']}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={formik.errors.disableJdkLogger && formik.touched.disableJdkLogger}
            disabled={viewOnly}
            doc_category={DOC_CATEGORY}
            errorMessage={formik.errors.disableJdkLogger}
          />
        </Col>

        <Col sm={12}>
          <GluuSelectRow
            label="fields.logging_level"
            name="loggingLevel"
            value={formik.values.loggingLevel}
            defaultValue={formik.values.loggingLevel}
            values={['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF']}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
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
            doc_category={DOC_CATEGORY}
            showError={formik.errors.loggingLayout && formik.touched.loggingLayout}
            errorMessage={formik.errors.loggingLayout}
            disabled={viewOnly}
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
            doc_category={DOC_CATEGORY}
            showError={
              formik.errors.externalLoggerConfiguration &&
              formik.touched.externalLoggerConfiguration
            }
            errorMessage={formik.errors.externalLoggerConfiguration}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={12}>
          <GluuSelectRow
            label="fields.metric_reporter_enabled"
            name="metricReporterEnabled"
            value={formik.values.metricReporterEnabled}
            defaultValue={formik.values.metricReporterEnabled}
            values={['true', 'false']}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={DOC_CATEGORY}
            showError={formik.errors.metricReporterEnabled && formik.touched.metricReporterEnabled}
            disabled={viewOnly}
            errorMessage={formik.errors.metricReporterEnabled}
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
            doc_category={DOC_CATEGORY}
            showError={
              formik.errors.metricReporterInterval && formik.touched.metricReporterInterval
            }
            disabled={viewOnly}
            errorMessage={formik.errors.metricReporterInterval}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.metric_reporter_keep_data_days"
            name="metricReporterKeepDataDays"
            type="number"
            doc_category={DOC_CATEGORY}
            value={formik.values.metricReporterKeepDataDays || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            showError={
              formik.errors.metricReporterKeepDataDays && formik.touched.metricReporterKeepDataDays
            }
            disabled={viewOnly}
            errorMessage={formik.errors.metricReporterKeepDataDays}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.clean_service_interval"
            name="cleanServiceInterval"
            value={formik.values.cleanServiceInterval || ''}
            formik={formik}
            doc_category={DOC_CATEGORY}
            lsize={3}
            rsize={9}
            showError={formik.errors.cleanServiceInterval && formik.touched.cleanServiceInterval}
            disabled={viewOnly}
            errorMessage={formik.errors.cleanServiceInterval}
            type="number"
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.clean_batch_chunk_size"
            name="cleanServiceBatchChunkSize"
            value={formik.values.cleanServiceBatchChunkSize || ''}
            formik={formik}
            doc_category={DOC_CATEGORY}
            lsize={3}
            rsize={9}
            showError={
              formik.errors.cleanServiceBatchChunkSize && formik.touched.cleanServiceBatchChunkSize
            }
            disabled={viewOnly}
            errorMessage={formik.errors.cleanServiceBatchChunkSize}
            type="number"
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.metric_channel"
            name="metricChannel"
            value={formik.values.metricChannel || ''}
            formik={formik}
            doc_category={DOC_CATEGORY}
            lsize={3}
            rsize={9}
            showError={formik.errors.metricChannel && formik.touched.metricChannel}
            disabled={viewOnly}
            errorMessage={formik.errors.metricChannel}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.pdp_type"
            name="pdpType"
            value={formik.values.pdpType || ''}
            formik={formik}
            doc_category={DOC_CATEGORY}
            lsize={3}
            rsize={9}
            showError={formik.errors.pdpType && formik.touched.pdpType}
            errorMessage={formik.errors.pdpType}
            disabled={viewOnly}
          />
        </Col>

        {/* OPA Configuration Starts */}
        {/* <Col sm={12}>
          <Accordion className="mb-2 b-primary" initialOpen>
            <Accordion.Header className="text-primary">
              <GluuLabel
                style={{
                  color: customColors.lightBlue,
                }}
                label={'fields.opa_configuration'}
                required={false}
              />
            </Accordion.Header>
            <Accordion.Body>
              <GluuInputRow
                label="fields.base_url"
                name="opaConfiguration.baseUrl"
                value={formik.values.opaConfiguration?.baseUrl || ''}
                formik={formik}
                doc_category={DOC_CATEGORY}
                lsize={3}
                rsize={9}
                disabled={viewOnly}
              />
              <GluuInputRow
                label="fields.access_token"
                name="opaConfiguration.accessToken"
                value={formik.values.opaConfiguration?.accessToken || ''}
                formik={formik}
                doc_category={DOC_CATEGORY}
                lsize={3}
                rsize={9}
                disabled={viewOnly}
              />
            </Accordion.Body>
          </Accordion>
        </Col> */}

        {/* OPA Configuration Ends */}

        <Col sm={12}>
          <GluuInputRow
            label="fields.policies_json_uris_authorization_token"
            name="policiesJsonUrisAuthorizationToken"
            value={formik.values.policiesJsonUrisAuthorizationToken || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={viewOnly}
            doc_category={DOC_CATEGORY}
          />
        </Col>

        <Col sm={12}>
          <GluuTypeAhead
            name="policiesJsonUris"
            label="fields.policies_json_uris"
            value={formik.values.policiesJsonUris}
            options={lockConfigs?.policiesJsonUris || []}
            doc_category={DOC_CATEGORY}
            onChange={(options) => {
              const getLabel = (item) => item?.customOption && item?.policiesJsonUris
              const values = options?.map((item) =>
                typeof item == 'string' ? item : getLabel(item),
              )
              formik.setFieldValue('policiesJsonUris', values)
            }}
            lsize={3}
            rsize={9}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.policies_zip_uris_authorization_token"
            name="policiesZipUrisAuthorizationToken"
            value={formik.values.policiesZipUrisAuthorizationToken || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={12}>
          <GluuTypeAhead
            name="policiesZipUris"
            label="fields.policies_zip_uris"
            value={formik.values.policiesZipUris}
            options={lockConfigs?.policiesZipUris || []}
            doc_category={DOC_CATEGORY}
            onChange={(options) => {
              const getLabel = (item) => item?.customOption && item?.policiesZipUris
              const values = options?.map((item) =>
                typeof item == 'string' ? item : getLabel(item),
              )
              formik.setFieldValue('policiesZipUris', values)
            }}
            lsize={3}
            rsize={9}
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>

      {!viewOnly && (
        <>
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
        </>
      )}
    </Form>
  )
}

export default JansLockConfiguration
