import React, { useEffect, useContext, useState, useMemo, useCallback } from 'react'
import { Form, Button, FormGroup, Card, CardBody, Col, CustomInput } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { JSON_CONFIG } from 'Utils/ApiResources'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import {
  getLoggingConfig,
  editLoggingConfig,
} from 'Plugins/auth-server/redux/features/loggingSlice'
import { LOGGING_READ, LOGGING_WRITE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { getChangedFields, getMergedValues } from '@/helpers'

function LoggingPage() {
  const { t } = useTranslation()
  const { hasCedarPermission, authorize } = useCedarling()
  const theme = useContext(ThemeContext)
  const logging = useSelector((state) => state.loggingReducer.logging)
  const loading = useSelector((state) => state.loggingReducer.loading)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  const dispatch = useDispatch()
  const selectedTheme = theme.state.theme

  const [showCommitDialog, setShowCommitDialog] = useState(false)
  const [pendingValues, setPendingValues] = useState(null)
  const [localLogging, setLocalLogging] = useState(null)

  useEffect(() => {
    const initPermissions = async () => {
      const permissions = [LOGGING_READ, LOGGING_WRITE]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    initPermissions()
    dispatch(getLoggingConfig())
  }, [dispatch, authorize])

  useEffect(() => {
    if (logging) {
      setLocalLogging(logging)
    }
  }, [logging])

  useEffect(() => {}, [cedarPermissions])

  const initialValues = useMemo(
    () => ({
      loggingLevel: localLogging?.loggingLevel,
      loggingLayout: localLogging?.loggingLayout,
      httpLoggingEnabled: localLogging?.httpLoggingEnabled,
      disableJdkLogger: localLogging?.disableJdkLogger,
      enabledOAuthAuditLogging: localLogging?.enabledOAuthAuditLogging,
    }),
    [localLogging],
  )

  const levels = useMemo(() => ['TRACE', 'DEBUG', 'INFO', 'ERROR', 'WARN'], [])
  const logLayouts = useMemo(() => ['text', 'json'], [])
  SetTitle('Logging')

  const handleSubmit = useCallback(
    (values) => {
      const mergedValues = getMergedValues(localLogging, values)
      const changedFields = getChangedFields(localLogging, mergedValues)

      setPendingValues({ mergedValues, changedFields })
      setShowCommitDialog(true)
    },
    [localLogging],
  )

  const handleAccept = useCallback(
    (userMessage) => {
      if (pendingValues) {
        const { mergedValues, changedFields } = pendingValues

        const opts = {}
        opts['logging'] = JSON.stringify(mergedValues)

        dispatch(
          editLoggingConfig({
            data: opts,
            otherFields: { userMessage, changedFields },
          }),
        )
        setShowCommitDialog(false)
        setPendingValues(null)
      }
    },
    [pendingValues, dispatch],
  )

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody style={{ minHeight: 500 }}>
          <GluuViewWrapper canShow={hasCedarPermission(LOGGING_READ)}>
            <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
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
                        onChange={(e) => formik.setFieldValue('loggingLevel', e.target.value)}
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
                        onChange={(e) => formik.setFieldValue('loggingLayout', e.target.value)}
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
                    handler={(e) => formik.setFieldValue('httpLoggingEnabled', e.target.checked)}
                    lsize={5}
                    rsize={7}
                    value={formik.values.httpLoggingEnabled}
                    doc_category={JSON_CONFIG}
                  />
                  <GluuToogleRow
                    label="fields.disable_jdk_logger"
                    name="disableJdkLogger"
                    handler={(e) => formik.setFieldValue('disableJdkLogger', e.target.checked)}
                    lsize={5}
                    rsize={7}
                    doc_category={JSON_CONFIG}
                    value={formik.values.disableJdkLogger}
                  />
                  <GluuToogleRow
                    label="fields.enabled_oAuth_audit_logging"
                    name="enabledOAuthAuditLogging"
                    handler={(e) =>
                      formik.setFieldValue('enabledOAuthAuditLogging', e.target.checked)
                    }
                    lsize={5}
                    rsize={7}
                    doc_category={JSON_CONFIG}
                    value={formik.values.enabledOAuthAuditLogging}
                  />

                  {hasCedarPermission(LOGGING_WRITE) && (
                    <Button color={`primary-${selectedTheme}`} type="submit">
                      <i className="fa fa-check-circle me-2"></i>
                      {t('actions.save')}
                    </Button>
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
