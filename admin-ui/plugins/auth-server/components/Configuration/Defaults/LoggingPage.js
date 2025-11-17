import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Form, FormGroup, Card, CardBody, Col, CustomInput, Row } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { JSON_CONFIG } from 'Utils/ApiResources'
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
import { getChangedFields, getMergedValues } from '@/helpers'

function LoggingPage() {
  const { t } = useTranslation()
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const logging = useSelector((state) => state.loggingReducer.logging)
  const loading = useSelector((state) => state.loggingReducer.loading)
  const dispatch = useDispatch()

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
  const [pendingValues, setPendingValues] = useState(null)
  const [localLogging, setLocalLogging] = useState(null)

  useEffect(() => {
    if (loggingScopes && loggingScopes.length > 0) {
      authorizeHelper(loggingScopes)
    }
  }, [authorizeHelper, loggingScopes])

  useEffect(() => {
    if (canReadLogging === true) {
      dispatch(getLoggingConfig())
    }
  }, [canReadLogging, dispatch])

  useEffect(() => {
    if (logging) {
      setLocalLogging(logging)
    }
  }, [logging])

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
          <GluuViewWrapper canShow={canReadLogging}>
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

                  {canWriteLogging && (
                    <Row>
                      <Col>
                        <GluuCommitFooter
                          saveHandler={formik.handleSubmit}
                          extraLabel={t('actions.cancel')}
                          extraOnClick={() => formik.resetForm()}
                          hideButtons={{ save: true, back: true }}
                          type="submit"
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
