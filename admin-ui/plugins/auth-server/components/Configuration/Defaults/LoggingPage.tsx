import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Form, FormGroup, Card, CardBody, Col, CustomInput, Row } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { JSON_CONFIG } from 'Utils/ApiResources'
import {
  LOG_LEVELS,
  LOG_LAYOUTS,
  getLoggingInitialValues,
  getMergedValues,
  getChangedFields,
} from './utils'
import type { LoggingFormValues } from './utils'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import {
  getLoggingConfig,
  editLoggingConfig,
} from 'Plugins/auth-server/redux/features/loggingSlice'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import type { Logging } from 'JansConfigApi'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import { useNavigate } from 'react-router'
import { loggingValidationSchema } from './validations'
import type { RootState } from 'Plugins/auth-server/redux/features/types/loggingTypes'

interface PendingValues {
  mergedValues: Logging
  changedFields: Record<string, { oldValue: unknown; newValue: unknown }>
}

function LoggingPage(): React.ReactElement {
  const { t } = useTranslation()
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const logging = useSelector((state: RootState) => state.loggingReducer.logging)
  const loading = useSelector((state: RootState) => state.loggingReducer.loading)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loggingResourceId = ADMIN_UI_RESOURCES.Logging
  const loggingScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[loggingResourceId] || [],
    [loggingResourceId],
  )

  const canReadLogging = useMemo(
    () => !!hasCedarReadPermission(loggingResourceId),
    [hasCedarReadPermission, loggingResourceId],
  )

  const canWriteLogging = useMemo(
    () => !!hasCedarWritePermission(loggingResourceId),
    [hasCedarWritePermission, loggingResourceId],
  )

  const [showCommitDialog, setShowCommitDialog] = useState(false)
  const [pendingValues, setPendingValues] = useState<PendingValues | null>(null)
  const [localLogging, setLocalLogging] = useState<Logging | null>(null)

  useEffect(() => {
    if (loggingScopes && loggingScopes.length > 0) {
      authorizeHelper(loggingScopes)
    }
  }, [authorizeHelper, loggingScopes])

  useEffect(() => {
    if (canReadLogging) {
      dispatch(getLoggingConfig())
    }
  }, [canReadLogging, dispatch])

  useEffect(() => {
    if (logging) {
      setLocalLogging(logging)
    }
  }, [logging])

  const initialValues: LoggingFormValues = useMemo(
    () => getLoggingInitialValues(localLogging),
    [localLogging],
  )

  const levels = useMemo(() => [...LOG_LEVELS], [])
  const logLayouts = useMemo(() => [...LOG_LAYOUTS], [])
  SetTitle('Logging')

  const handleSubmit = useCallback(
    (values: LoggingFormValues): void => {
      if (!localLogging) {
        console.error('Cannot submit: logging data not loaded')
        return
      }

      const mergedValues = getMergedValues(
        localLogging as unknown as Record<string, unknown>,
        values as unknown as Record<string, unknown>,
      ) as unknown as Logging
      const changedFieldsResult = getChangedFields(
        localLogging as unknown as Record<string, unknown>,
        mergedValues as unknown as Record<string, unknown>,
      )
      const changedFields: Record<string, { oldValue: unknown; newValue: unknown }> = {}
      Object.keys(changedFieldsResult).forEach((key) => {
        const fieldChange = changedFieldsResult[key]
        if (fieldChange) {
          changedFields[key] = fieldChange
        }
      })

      setPendingValues({ mergedValues, changedFields })
      setShowCommitDialog(true)
    },
    [localLogging],
  )

  const handleAccept = useCallback(
    (userMessage: string): void => {
      if (!pendingValues) return

      const { mergedValues, changedFields } = pendingValues

      const opts: Record<string, string> = {}
      opts['logging'] = JSON.stringify(mergedValues)

      type EditLoggingPayload = {
        data: Record<string, string>
        otherFields: {
          userMessage: string
          changedFields: Record<string, { oldValue: unknown; newValue: unknown }>
        }
      }

      dispatch(
        (
          editLoggingConfig as unknown as (payload: EditLoggingPayload) => {
            type: string
            payload: EditLoggingPayload
          }
        )({
          data: opts,
          otherFields: { userMessage, changedFields },
        }),
      )
      setShowCommitDialog(false)
      setPendingValues(null)
    },
    [pendingValues, dispatch],
  )

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody style={{ minHeight: 500 }}>
          <GluuViewWrapper canShow={canReadLogging}>
            <Formik
              initialValues={initialValues}
              validationSchema={loggingValidationSchema}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <GluuLabel
                      label="fields.log_level"
                      size={4}
                      doc_category={JSON_CONFIG}
                      doc_entry="loggingLevel"
                    />
                    <Col sm={8}>
                      <CustomInput
                        type="select"
                        id="loggingLevel"
                        name="loggingLevel"
                        data-testid="loggingLevel"
                        value={formik.values.loggingLevel}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          formik.setFieldValue('loggingLevel', e.target.value)
                        }
                      >
                        <option value="">{t('actions.choose')}...</option>
                        {levels.map((item, key) => (
                          <option value={item} key={key}>
                            {item}
                          </option>
                        ))}
                      </CustomInput>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <GluuLabel
                      label="fields.log_layout"
                      size={4}
                      doc_category={JSON_CONFIG}
                      doc_entry="loggingLayout"
                    />
                    <Col sm={8}>
                      <CustomInput
                        type="select"
                        id="loggingLayout"
                        name="loggingLayout"
                        data-testid="loggingLayout"
                        value={formik.values.loggingLayout}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          formik.setFieldValue('loggingLayout', e.target.value)
                        }
                      >
                        <option value="">{t('actions.choose')}...</option>
                        {logLayouts.map((item, key) => (
                          <option value={item} key={key}>
                            {item}
                          </option>
                        ))}
                      </CustomInput>
                    </Col>
                  </FormGroup>

                  <GluuToogleRow
                    label="fields.http_logging_enabled"
                    name="httpLoggingEnabled"
                    handler={(e: React.ChangeEvent<HTMLInputElement>) =>
                      formik.setFieldValue('httpLoggingEnabled', e.target.checked)
                    }
                    lsize={5}
                    rsize={7}
                    value={formik.values.httpLoggingEnabled}
                    doc_category={JSON_CONFIG}
                  />
                  <GluuToogleRow
                    label="fields.disable_jdk_logger"
                    name="disableJdkLogger"
                    handler={(e: React.ChangeEvent<HTMLInputElement>) =>
                      formik.setFieldValue('disableJdkLogger', e.target.checked)
                    }
                    lsize={5}
                    rsize={7}
                    doc_category={JSON_CONFIG}
                    value={formik.values.disableJdkLogger}
                  />
                  <GluuToogleRow
                    label="fields.enabled_oAuth_audit_logging"
                    name="enabledOAuthAuditLogging"
                    handler={(e: React.ChangeEvent<HTMLInputElement>) =>
                      formik.setFieldValue('enabledOAuthAuditLogging', e.target.checked)
                    }
                    lsize={5}
                    rsize={7}
                    doc_category={JSON_CONFIG}
                    value={formik.values.enabledOAuthAuditLogging}
                  />

                  {canWriteLogging && (
                    <Row>
                      <Col>
                        <GluuFormFooter
                          showBack={true}
                          onBack={() => navigate('/home/dashboard')}
                          showCancel={true}
                          onCancel={() => formik.resetForm()}
                          disableCancel={!formik.dirty}
                          showApply={true}
                          onApply={formik.handleSubmit}
                          disableApply={!formik.isValid || !formik.dirty}
                          applyButtonType="button"
                          isLoading={loading}
                        />
                      </Col>
                    </Row>
                  )}
                </Form>
              )}
            </Formik>

            <GluuCommitDialog
              handler={() => setShowCommitDialog(false)}
              modal={showCommitDialog}
              onAccept={handleAccept}
              isLicenseLabel={false}
            />
          </GluuViewWrapper>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default LoggingPage
