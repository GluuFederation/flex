import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Form, FormGroup, Card, CardBody, Col, CustomInput } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import { JSON_CONFIG } from 'Utils/ApiResources'
import { loggingValidationSchema } from './validations'
import {
  LOG_LEVELS,
  LOG_LAYOUTS,
  getLoggingInitialValues,
  getMergedValues,
  getChangedFields,
} from './utils'
import type { LoggingFormValues } from './utils'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useGetConfigLogging, usePutConfigLogging, type Logging } from 'JansConfigApi'
import { LOGGING_READ, LOGGING_WRITE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { useLoggingActions, type ModifiedFields } from './hooks/useLoggingActions'
import { toast } from 'react-toastify'

interface PendingValues {
  mergedValues: Logging
  changedFields: ModifiedFields
}

function LoggingPage(): React.ReactElement {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { hasCedarPermission, authorize } = useCedarling()
  const { logLoggingUpdate } = useLoggingActions()

  const [showCommitDialog, setShowCommitDialog] = useState(false)
  const [pendingValues, setPendingValues] = useState<PendingValues | null>(null)
  const [localLogging, setLocalLogging] = useState<Logging | null>(null)
  const [permissionsInitialized, setPermissionsInitialized] = useState(false)
  const [permissionError, setPermissionError] = useState(false)

  const {
    data: logging,
    isLoading: isLoadingData,
    error: loggingError,
  } = useGetConfigLogging({
    query: {
      enabled: permissionsInitialized && hasCedarPermission(LOGGING_READ),
    },
  })
  const updateLogging = usePutConfigLogging()

  useEffect(() => {
    let isMounted = true

    const initPermissions = async (): Promise<void> => {
      const readResult = await authorize([LOGGING_READ])
      await authorize([LOGGING_WRITE])

      if (!isMounted) return

      if (!readResult.isAuthorized) {
        console.error('Failed to authorize READ permission:', readResult.error)
        setPermissionError(true)
      }

      setPermissionsInitialized(true)
    }

    initPermissions()

    return () => {
      isMounted = false
    }
  }, [authorize])

  useEffect(() => {
    if (logging) {
      setLocalLogging(logging)
    }
  }, [logging])

  const initialValues: LoggingFormValues = useMemo(
    () => getLoggingInitialValues(localLogging),
    [localLogging],
  )

  const levels = LOG_LEVELS
  const logLayouts = LOG_LAYOUTS
  SetTitle('Logging')

  const handleSubmit = useCallback(
    (values: LoggingFormValues): void => {
      if (!localLogging) {
        console.error('Cannot submit: logging data not loaded')
        return
      }

      const mergedValues = getMergedValues(localLogging, values)
      const changedFields = getChangedFields(localLogging, mergedValues)

      if (Object.keys(changedFields).length === 0) {
        return
      }

      setPendingValues({ mergedValues, changedFields })
      setShowCommitDialog(true)
    },
    [localLogging],
  )

  const handleAccept = useCallback(
    async (userMessage: string): Promise<void> => {
      if (!pendingValues) return

      const { mergedValues, changedFields } = pendingValues

      try {
        const result = await updateLogging.mutateAsync({ data: mergedValues })

        setLocalLogging(result)

        logLoggingUpdate(userMessage, changedFields).catch((error) =>
          console.error('Audit logging failed:', error),
        )

        toast.success(t('messages.success_in_saving'))

        setShowCommitDialog(false)
        setPendingValues(null)
      } catch (error) {
        console.error('Failed to update logging configuration:', error)
        toast.error(t('messages.error_in_saving'))
      }
    },
    [pendingValues, updateLogging, logLoggingUpdate, t],
  )

  const isLoading = !permissionsInitialized || isLoadingData || updateLogging.isPending

  if (loggingError) {
    console.error('Failed to load logging configuration:', loggingError)
    return (
      <GluuLoader blocking={false}>
        <Card style={applicationStyle.mainCard}>
          <CardBody style={{ minHeight: 500 }}>
            <div className="alert alert-danger" role="alert">
              {t('messages.error_loading_logging')}
            </div>
          </CardBody>
        </Card>
      </GluuLoader>
    )
  }

  if (permissionError) {
    return (
      <GluuLoader blocking={false}>
        <Card style={applicationStyle.mainCard}>
          <CardBody style={{ minHeight: 500 }}>
            <div className="alert alert-danger" role="alert">
              {t('messages.permission_error')}
            </div>
          </CardBody>
        </Card>
      </GluuLoader>
    )
  }

  return (
    <GluuLoader blocking={isLoading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody style={{ minHeight: 500 }}>
          <GluuViewWrapper canShow={hasCedarPermission(LOGGING_READ)}>
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

                  {hasCedarPermission(LOGGING_WRITE) && (
                    <GluuFormFooter
                      showBack={true}
                      onBack={() => {
                        if (window.history.length > 1) {
                          navigate(-1)
                        } else {
                          navigate('/auth-server/config/logging')
                        }
                      }}
                      showCancel={true}
                      onCancel={() => formik.resetForm()}
                      disableCancel={!formik.dirty}
                      showApply={true}
                      onApply={formik.handleSubmit}
                      disableApply={!formik.isValid || !formik.dirty}
                      applyButtonType="button"
                      isLoading={isLoading}
                    />
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
