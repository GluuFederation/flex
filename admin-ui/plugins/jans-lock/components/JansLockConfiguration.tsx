import { useFormik } from 'formik'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { buildPayload, JANS_LOCK_WRITE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from '@/routes/Apps/Gluu/GluuFormFooter'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import {
  validationSchema,
  transformToFormValues,
  createPatchOperations,
  jansLockConstants,
} from '../helper'
import { JansLockConfigFormValues, PatchOperation } from '../types'
import { trimObjectStrings } from 'Utils/Util'

interface JansLockConfigurationProps {
  lockConfig: Record<string, unknown>
  onUpdate: (patches: PatchOperation[]) => void
  isSubmitting?: boolean
}

const JansLockConfiguration: React.FC<JansLockConfigurationProps> = ({
  lockConfig,
  onUpdate,
  isSubmitting,
}) => {
  const { hasCedarPermission, authorize } = useCedarling()
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
  }, [authorize])

  const toggle = useCallback(() => {
    setModal(!modal)
  }, [modal])

  const formik = useFormik<JansLockConfigFormValues>({
    initialValues: transformToFormValues(lockConfig),
    enableReinitialize: true,
    onSubmit: () => toggle(),
    validationSchema,
  })

  const handleCancel = useCallback(() => {
    formik.resetForm()
  }, [formik])

  const trimmedValuesAndPatches = useMemo(() => {
    if (!lockConfig || !formik.values) {
      return {
        trimmedValues: null as JansLockConfigFormValues | null,
        patches: [] as PatchOperation[],
      }
    }
    const trimmedValues = trimObjectStrings(formik.values)
    const patches = createPatchOperations(trimmedValues, lockConfig)
    return { trimmedValues, patches }
  }, [lockConfig, formik.values])

  const isFormDirty = useMemo(() => {
    return trimmedValuesAndPatches.patches.length > 0
  }, [trimmedValuesAndPatches])

  const isFormValid = useMemo(() => {
    if (!formik.values) {
      return false
    }
    return validationSchema.isValidSync(formik.values)
  }, [formik.values])

  const submitForm = useCallback(
    (userMessage: string) => {
      const { patches: patchOperations } = trimmedValuesAndPatches

      toggle()

      if (patchOperations.length > 0) {
        const userAction: Record<string, unknown> = {}
        buildPayload(userAction, userMessage, {})
        userAction.action_message = userMessage
        userAction.action_data = patchOperations

        onUpdate(patchOperations)
      }
      // Silently do nothing if no changes (better UX than showing a toast)
    },
    [trimmedValuesAndPatches, toggle, onUpdate],
  )

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
          <GluuTypeAhead
            name="tokenChannels"
            label="fields.token_channels"
            value={formik.values.tokenChannels}
            onChange={(options: unknown) => {
              const getLabel = (item: unknown) =>
                typeof item === 'object' &&
                item !== null &&
                'customOption' in item &&
                'tokenChannels' in item &&
                (item as { customOption: boolean; tokenChannels: string }).customOption
                  ? (item as { tokenChannels: string }).tokenChannels
                  : null
              const values = ((options as unknown[]) || [])
                .map((item: unknown) => (typeof item === 'string' ? item : getLabel(item)))
                .filter((v: unknown): v is string => typeof v === 'string' && v !== null)
              formik.setFieldValue('tokenChannels', values)
            }}
            options={(lockConfig?.tokenChannels as string[]) || []}
            doc_category={jansLockConstants.DOC_CATEGORY}
            lsize={3}
            rsize={9}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={12}>
          <GluuSelectRow
            label="fields.disable_jdk_logger"
            name="disableJdkLogger"
            value={String(formik.values.disableJdkLogger)}
            values={['true', 'false']}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={viewOnly}
            doc_category={jansLockConstants.DOC_CATEGORY}
            errorMessage={formik.errors.disableJdkLogger as string}
          />
        </Col>

        <Col sm={12}>
          <GluuSelectRow
            label="fields.logging_level"
            name="loggingLevel"
            value={formik.values.loggingLevel}
            values={[...jansLockConstants.LOGGING_LEVELS]}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={jansLockConstants.DOC_CATEGORY}
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
            doc_category={jansLockConstants.DOC_CATEGORY}
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
            doc_category={jansLockConstants.DOC_CATEGORY}
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
            value={String(formik.values.metricReporterEnabled)}
            values={['true', 'false']}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={jansLockConstants.DOC_CATEGORY}
            disabled={viewOnly}
            errorMessage={formik.errors.metricReporterEnabled as string}
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
            doc_category={jansLockConstants.DOC_CATEGORY}
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
            doc_category={jansLockConstants.DOC_CATEGORY}
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
            doc_category={jansLockConstants.DOC_CATEGORY}
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
            doc_category={jansLockConstants.DOC_CATEGORY}
            lsize={3}
            rsize={9}
            showError={
              formik.errors.cleanServiceBatchChunkSize && formik.touched.cleanServiceBatchChunkSize
            }
            disabled={viewOnly}
            errorMessage={formik.errors.cleanServiceBatchChunkSize}
            type="number"
            min={1}
            step={1}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.base_dn"
            name="baseDN"
            value={formik.values.baseDN || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={jansLockConstants.DOC_CATEGORY}
            showError={formik.errors.baseDN && formik.touched.baseDN}
            errorMessage={formik.errors.baseDN}
            disabled={true}
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
            doc_category={jansLockConstants.DOC_CATEGORY}
            showError={formik.errors.baseEndpoint && formik.touched.baseEndpoint}
            errorMessage={formik.errors.baseEndpoint}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.client_id"
            name="clientId"
            value={formik.values.clientId || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={jansLockConstants.DOC_CATEGORY}
            showError={formik.errors.clientId && formik.touched.clientId}
            errorMessage={formik.errors.clientId}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={12}>
          <GluuSelectRow
            label="fields.error_reason_enabled"
            name="errorReasonEnabled"
            value={String(formik.values.errorReasonEnabled)}
            values={['true', 'false']}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={jansLockConstants.DOC_CATEGORY}
            disabled={viewOnly}
            errorMessage={formik.errors.errorReasonEnabled as string}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.message_consumer_type"
            name="messageConsumerType"
            value={formik.values.messageConsumerType || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={jansLockConstants.DOC_CATEGORY}
            showError={formik.errors.messageConsumerType && formik.touched.messageConsumerType}
            errorMessage={formik.errors.messageConsumerType}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.openid_issuer"
            name="openIdIssuer"
            value={formik.values.openIdIssuer || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={jansLockConstants.DOC_CATEGORY}
            showError={formik.errors.openIdIssuer && formik.touched.openIdIssuer}
            errorMessage={formik.errors.openIdIssuer}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={12}>
          <GluuSelectRow
            label="fields.stat_enabled"
            name="statEnabled"
            value={String(formik.values.statEnabled)}
            values={['true', 'false']}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={jansLockConstants.DOC_CATEGORY}
            disabled={viewOnly}
            errorMessage={formik.errors.statEnabled as string}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.stat_timer_interval"
            name="statTimerIntervalInSeconds"
            type="number"
            value={formik.values.statTimerIntervalInSeconds || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={jansLockConstants.DOC_CATEGORY}
            showError={
              formik.errors.statTimerIntervalInSeconds && formik.touched.statTimerIntervalInSeconds
            }
            errorMessage={formik.errors.statTimerIntervalInSeconds}
            disabled={viewOnly}
          />
        </Col>

        <Col sm={12}>
          <GluuInputRow
            label="fields.token_url"
            name="tokenUrl"
            value={formik.values.tokenUrl || ''}
            formik={formik}
            lsize={3}
            rsize={9}
            doc_category={jansLockConstants.DOC_CATEGORY}
            showError={formik.errors.tokenUrl && formik.touched.tokenUrl}
            errorMessage={formik.errors.tokenUrl}
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>

      {!viewOnly && (
        <>
          <Row>
            <Col>
              <GluuFormFooter
                showBack={true}
                showCancel={true}
                showApply={true}
                onApply={toggle}
                onCancel={handleCancel}
                disableBack={false}
                disableCancel={!isFormDirty}
                disableApply={!isFormValid || !isFormDirty}
                applyButtonType="submit"
                isLoading={isSubmitting ?? false}
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
