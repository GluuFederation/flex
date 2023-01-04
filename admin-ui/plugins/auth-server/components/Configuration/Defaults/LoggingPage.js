import React, { useEffect, useContext } from 'react'
import {
  Form,
  Button,
  FormGroup,
  Card,
  CardBody,
  Col,
  CustomInput,
} from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuCheckBoxRow from 'Routes/Apps/Gluu/GluuCheckBoxRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { JSON_CONFIG } from 'Utils/ApiResources'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import {
  getLoggingConfig,
  editLoggingConfig,
} from 'Plugins/auth-server/redux/actions/LoggingActions'
import {
  hasPermission,
  LOGGING_READ,
  LOGGING_WRITE,
} from 'Utils/PermChecker'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'

function LoggingPage({ logging, dispatch, permissions, loading }) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
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
                dispatch(editLoggingConfig(opts))
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row></FormGroup>
                  
                    <FormGroup row>
                      <GluuLabel label="fields.log_level" size={4} doc_category={JSON_CONFIG} doc_entry="loggingLevel" />
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
                      <GluuLabel label="fields.log_layout" size={4} doc_category={JSON_CONFIG} doc_entry="loggingLayout"/>
                      <Col sm={8}>
                        <CustomInput
                          type="select"
                          id="loggingLayout"
                          name="loggingLayout"
                          data-testid="loggingLayout"
                          value={logging.loggingLayout}
                          onChange={(e) => {
                            logging.loggingLayout = e.target.value
                            formik.setFieldValue(
                              'loggingLayout',
                              e.target.value,
                            )
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
                  <GluuCheckBoxRow
                    label="fields.http_logging_enabled"
                    name="httpLoggingEnabled"
                    handleOnChange={(e) => {
                      formik.setFieldValue(
                        'httpLoggingEnabled',
                        e.target.checked,
                      )
                    }}
                    lsize={5}
                    rsize={7}
                    value={logging.httpLoggingEnabled}
                    doc_category={JSON_CONFIG}
                  ></GluuCheckBoxRow>
                  <GluuCheckBoxRow
                    label="fields.disable_jdk_logger"
                    name="disableJdkLogger"
                    handleOnChange={(e) => {
                      formik.setFieldValue('disableJdkLogger', e.target.checked)
                    }}
                    lsize={5}
                    rsize={7}
                    doc_category={JSON_CONFIG}
                    value={logging.disableJdkLogger}
                  ></GluuCheckBoxRow>
                  <GluuCheckBoxRow
                    label="fields.enabled_oAuth_audit_logging"
                    name="enabledOAuthAuditLogging"
                    handleOnChange={(e) => {
                      formik.setFieldValue(
                        'enabledOAuthAuditLogging',
                        e.target.checked,
                      )
                    }}
                    lsize={5}
                    rsize={7}
                    doc_category={JSON_CONFIG}
                    value={logging.enabledOAuthAuditLogging}
                  ></GluuCheckBoxRow>

                  {hasPermission(permissions, LOGGING_WRITE) && (
                    <Button
                      color={`primary-${selectedTheme}`}
                      type="submit"
                    >
                      <i className="fa fa-check-circle mr-2"></i>
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
const mapStateToProps = (state) => {
  return {
    logging: state.loggingReducer.logging,
    loading: state.loggingReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(LoggingPage)
