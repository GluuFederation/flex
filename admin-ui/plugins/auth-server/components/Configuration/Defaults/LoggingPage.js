import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Form, FormGroup, Card, CardBody, Col, CustomInput, Row } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import { JSON_CONFIG } from 'Utils/ApiResources'
import { loggingValidationSchema } from './validations'
import { LOG_LEVELS, LOG_LAYOUTS, getLoggingInitialValues } from './utils'
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
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { getChangedFields, getMergedValues } from '@/helpers'

function LoggingPage() {
  const { t } = useTranslation()
  const { hasCedarPermission, authorize } = useCedarling()
  const logging = useSelector((state) => state.loggingReducer.logging)
  const loading = useSelector((state) => state.loggingReducer.loading)

  const dispatch = useDispatch()

  const [showCommitDialog, setShowCommitDialog] = useState(false)
  const [pendingValues, setPendingValues] = useState(null)
  const toggleCommitDialog = useCallback(() => setShowCommitDialog((prev) => !prev), [])

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

  const initialValues = useMemo(() => getLoggingInitialValues(logging), [logging])

  const levels = useMemo(() => LOG_LEVELS, [])
  const logLayouts = useMemo(() => LOG_LAYOUTS, [])
  SetTitle('Logging')

  const handleSubmit = useCallback(
    (values) => {
      const mergedValues = getMergedValues(logging, values)
      const changedFields = getChangedFields(logging, mergedValues)

      setPendingValues({ mergedValues, changedFields })
      setShowCommitDialog(true)
    },
    [logging],
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
            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={handleSubmit}
              validationSchema={loggingValidationSchema}
              validateOnMount
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <GluuLabel
                      label="fields.log_level"
                      size={4}
                      doc_category={JSON_CONFIG}
                      doc_entry="loggingLevel"
                      required
                    />
                    <Col sm={8}>
                      <CustomInput
                        type="select"
                        id="loggingLevel"
                        name="loggingLevel"
                        data-testid="loggingLevel"
                        value={formik.values.loggingLevel}
                        onChange={(e) => formik.setFieldValue('loggingLevel', e.target.value)}
                        onBlur={() => formik.setFieldTouched('loggingLevel', true)}
                        required
                        aria-required="true"
                      >
                        <option value="">{t('actions.choose')}...</option>
                        {levels.map((item, key) => (
                          <option value={item} key={key}>
                            {item}
                          </option>
                        ))}
                      </CustomInput>
                      {formik.touched.loggingLevel && formik.errors.loggingLevel && (
                        <div className="text-danger mt-1">{formik.errors.loggingLevel}</div>
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <GluuLabel
                      label="fields.log_layout"
                      size={4}
                      doc_category={JSON_CONFIG}
                      doc_entry="loggingLayout"
                      required
                    />
                    <Col sm={8}>
                      <CustomInput
                        type="select"
                        id="loggingLayout"
                        name="loggingLayout"
                        data-testid="loggingLayout"
                        value={formik.values.loggingLayout}
                        onChange={(e) => formik.setFieldValue('loggingLayout', e.target.value)}
                        onBlur={() => formik.setFieldTouched('loggingLayout', true)}
                        required
                        aria-required="true"
                      >
                        <option value="">{t('actions.choose')}...</option>
                        {logLayouts.map((item, key) => (
                          <option value={item} key={key}>
                            {item}
                          </option>
                        ))}
                      </CustomInput>
                      {formik.touched.loggingLayout && formik.errors.loggingLayout && (
                        <div className="text-danger mt-1">{formik.errors.loggingLayout}</div>
                      )}
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
                    <Row>
                      <Col>
                        <GluuFormFooter
                          showBack={true}
                          showCancel={true}
                          showApply={true}
                          onApply={formik.handleSubmit}
                          onCancel={() => formik.resetForm()}
                          disableBack={false}
                          disableCancel={!formik.dirty}
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
              handler={toggleCommitDialog}
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
