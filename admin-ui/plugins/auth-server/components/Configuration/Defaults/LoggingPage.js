import React, { useEffect, useContext } from 'react'
import { Form, Button, FormGroup, Card, CardBody, Col, CustomInput } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { JSON_CONFIG } from 'Utils/ApiResources'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import {
  getLoggingConfig,
  editLoggingConfig,
} from 'Plugins/auth-server/redux/features/loggingSlice'
import { hasPermission, LOGGING_READ, LOGGING_WRITE } from 'Utils/PermChecker'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'

function LoggingPage() {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const logging = useSelector((state) => state.loggingReducer.logging)
  const loading = useSelector((state) => state.loggingReducer.loading)
  const permissions = useSelector((state) => state.authReducer.permissions)

  const dispatch = useDispatch()

  const selectedTheme = theme.state.theme
  useEffect(() => {
    dispatch(getLoggingConfig())
  }, [])

  const initialValues = {
    loggingLevel: logging.loggingLevel,
    loggingLayout: logging.loggingLayout,
    httpLoggingEnabled: logging.httpLoggingEnabled,
    disableJdkLogger: logging.disableJdkLogger,
    enabledOAuthAuditLogging: logging.enabledOAuthAuditLogging,
  }
  const levels = ['TRACE', 'DEBUG', 'INFO', 'ERROR', 'WARN']
  const logLayouts = ['text', 'json']
  SetTitle('Logging')

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody style={{ minHeight: 500 }}>
          <GluuViewWrapper canShow={hasPermission(permissions, LOGGING_READ)}>
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => {
                values.httpLoggingEnabled =
                  values.httpLoggingEnabled != undefined
                    ? values.httpLoggingEnabled
                    : logging.httpLoggingEnabled
                values.disableJdkLogger =
                  values.disableJdkLogger != undefined
                    ? values.disableJdkLogger
                    : logging.disableJdkLogger
                values.enabledOAuthAuditLogging =
                  values.enabledOAuthAuditLogging != undefined
                    ? values.enabledOAuthAuditLogging
                    : logging.enabledOAuthAuditLogging

                const opts = {}
                opts['logging'] = JSON.stringify(values)
                dispatch(editLoggingConfig({ data: opts }))
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row></FormGroup>

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
                        value={logging.loggingLevel}
                        onChange={(e) => {
                          logging.loggingLevel = e.target.value
                          formik.setFieldValue('loggingLevel', e.target.value)
                        }}
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
                        value={logging.loggingLayout}
                        onChange={(e) => {
                          logging.loggingLayout = e.target.value
                          formik.setFieldValue('loggingLayout', e.target.value)
                        }}
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
                    handler={(e) => {
                      formik.setFieldValue('httpLoggingEnabled', e.target.checked)
                    }}
                    lsize={5}
                    rsize={7}
                    value={logging.httpLoggingEnabled}
                    doc_category={JSON_CONFIG}
                  />
                  <GluuToogleRow
                    label="fields.disable_jdk_logger"
                    name="disableJdkLogger"
                    handler={(e) => {
                      formik.setFieldValue('disableJdkLogger', e.target.checked)
                    }}
                    lsize={5}
                    rsize={7}
                    doc_category={JSON_CONFIG}
                    value={logging.disableJdkLogger}
                  />
                  <GluuToogleRow
                    label="fields.enabled_oAuth_audit_logging"
                    name="enabledOAuthAuditLogging"
                    handler={(e) => {
                      formik.setFieldValue('enabledOAuthAuditLogging', e.target.checked)
                    }}
                    lsize={5}
                    rsize={7}
                    doc_category={JSON_CONFIG}
                    value={logging.enabledOAuthAuditLogging}
                  />

                  {hasPermission(permissions, LOGGING_WRITE) && (
                    <Button color={`primary-${selectedTheme}`} type="submit">
                      <i className="fa fa-check-circle me-2"></i>
                      {t('actions.save')}
                    </Button>
                  )}
                </Form>
              )}
            </Formik>
          </GluuViewWrapper>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default LoggingPage
