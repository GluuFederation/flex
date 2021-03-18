import React, { useEffect } from 'react'
import { Form, Container, Card, CardBody } from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
import GluuSelectRow from '../Gluu/GluuSelectRow'
import GluuInputRow from '../Gluu/GluuInputRow'
import GluuCheckBoxRow from '../Gluu/GluuCheckBoxRow'
import GluuEmptyRow from '../Gluu/GluuEmptyRow'
import { connect } from 'react-redux'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import {
  getLoggingConfig,
  editLoggingConfig,
} from '../../../redux/actions/LoggingActions'
import {
  hasPermission,
  LOGGING_READ,
  LOGGING_WRITE,
} from '../../../utils/PermChecker'

function LoggingPage({ logging, dispatch, permissions, loading }) {
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
  return (
    <React.Fragment>
      <BlockUi
        tag="div"
        blocking={loading}
        keepInView={true}
        renderChildren={true}
        message={'Performing the request, please wait!'}
      >
        <Container>
          <Card>
            <CardBody>
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
                      label="Logging level"
                      name="loggingLevel"
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      value={logging.loggingLevel}
                      values={levels}
                    ></GluuSelectRow>
                    <GluuInputRow
                      label="Logging layout"
                      name="loggingLayout"
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      required
                      value={logging.loggingLayout}
                    ></GluuInputRow>
                    <GluuCheckBoxRow
                      label="Enable HTTP Logging"
                      name="httpLoggingEnabled"
                      formik={formik}
                      lsize={5}
                      rsize={7}
                      value={logging.httpLoggingEnabled}
                    ></GluuCheckBoxRow>
                    <GluuCheckBoxRow
                      label="Disable JSK Logger?"
                      name="disableJdkLogger"
                      formik={formik}
                      lsize={5}
                      rsize={7}
                      value={logging.disableJdkLogger}
                    ></GluuCheckBoxRow>
                    <GluuCheckBoxRow
                      label="Enable Oauth Audit Logging?"
                      name="enabledOAuthAuditLogging"
                      formik={formik}
                      lsize={5}
                      rsize={7}
                      value={logging.enabledOAuthAuditLogging}
                    ></GluuCheckBoxRow>
                    <GluuEmptyRow />
                    {hasPermission(permissions, LOGGING_WRITE) && (
                      <GluuFooter />
                    )}
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Container>
      </BlockUi>
    </React.Fragment>
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
