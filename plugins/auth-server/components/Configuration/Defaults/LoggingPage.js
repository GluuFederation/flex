import React, { useEffect } from 'react'
import { Form, Button } from '../../../../../app/components'
import GluuSelectRow from '../../../../../app/routes/Apps/Gluu/GluuSelectRow'
import GluuCheckBoxRow from '../../../../../app/routes/Apps/Gluu/GluuCheckBoxRow'
import GluuLoader from '../../../../../app/routes/Apps/Gluu/GluuLoader'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import {
  getLoggingConfig,
  editLoggingConfig,
} from '../../../redux/actions/LoggingActions'
import {
  hasPermission,
  LOGGING_READ,
  LOGGING_WRITE,
} from '../../../../../app/utils/PermChecker'
import { useTranslation } from 'react-i18next'

function LoggingPage({ logging, dispatch, permissions, loading }) {
  const { t } = useTranslation()
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
  const levels = ['TRACE', 'DEBUG', 'INFO', 'ERROR']
  const logLayouts = ['text', 'json']
  return (
    <GluuLoader blocking={loading}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const opts = {}
          opts['loggingConfiguration'] = JSON.stringify(values)
          dispatch(editLoggingConfig(opts))
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <GluuSelectRow
              label="fields.log_level"
              name="loggingLevel"
              formik={formik}
              lsize={4}
              rsize={8}
              value={logging.loggingLevel}
              values={levels}
            ></GluuSelectRow>
            <GluuSelectRow
              label="fields.log_layout"
              name="loggingLayout"
              formik={formik}
              lsize={4}
              rsize={8}
              required
              value={logging.loggingLayout}
              values={logLayouts}
            ></GluuSelectRow>
            <GluuCheckBoxRow
              label="fields.http_logging_enabled"
              name="httpLoggingEnabled"
              formik={formik}
              lsize={5}
              rsize={7}
              value={logging.httpLoggingEnabled}
            ></GluuCheckBoxRow>
            <GluuCheckBoxRow
              label="fields.disable_jdk_logger"
              name="disableJdkLogger"
              formik={formik}
              lsize={5}
              rsize={7}
              value={logging.disableJdkLogger}
            ></GluuCheckBoxRow>
            <GluuCheckBoxRow
              label="fields.enabled_oAuth_audit_logging"
              name="enabledOAuthAuditLogging"
              formik={formik}
              lsize={5}
              rsize={7}
              value={logging.enabledOAuthAuditLogging}
            ></GluuCheckBoxRow>

            {hasPermission(permissions, LOGGING_WRITE) && (
              <Button color="primary" type="submit">
                {t('actions.save')}
              </Button>
            )}
          </Form>
        )}
      </Formik>
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
