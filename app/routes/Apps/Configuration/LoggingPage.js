import React, { useEffect } from 'react'
import {
  Col,
  Form,
  FormGroup,
  Container,
  Input,
  Card,
  CardBody,
} from './../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuFooter from '../Gluu/GluuFooter'
import { connect } from 'react-redux'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import {
  getLoggingConfig,
  editLoggingConfig,
} from '../../../redux/actions/LoggingActions'
function LoggingPage({ logging, dispatch, loading }) {
  console.log('**********' + JSON.stringify(logging))
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
                onSubmit={(values, { setSubmitting }) => {
                  const opts = {}
                  opts['loggingConfiguration'] = JSON.stringify(values)
                  dispatch(editLoggingConfig(opts))
                }}
              >
                {(formik) => (
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup row>
                      <GluuLabel label="Logging level" required size={4} />
                      <Col sm={8}>
                        <Input
                          placeholder="Enter logging level."
                          id="loggingLevel"
                          name="loggingLevel"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.loggingLevel}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="Logging layout" required size={4} />
                      <Col sm={8}>
                        <Input
                          placeholder="Enter logging layout."
                          id="loggingLayout"
                          name="loggingLayout"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.loggingLayout}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="Enable HTTP Logging ?" size={5} />
                      <Col sm={2}>
                        <Input
                          id="httpLoggingEnabled"
                          name="httpLoggingEnabled"
                          type="checkbox"
                          onChange={formik.handleChange}
                          defaultChecked={formik.values.httpLoggingEnabled}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="Disable JSK Logger?" size={5} />
                      <Col sm={2}>
                        <Input
                          id="disableJdkLogger"
                          name="disableJdkLogger"
                          type="checkbox"
                          onChange={formik.handleChange}
                          defaultChecked={formik.values.disableJdkLogger}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="Enable Oauth Audit Logging?" size={5} />
                      <Col sm={2}>
                        <Input
                          id="enabledOAuthAuditLogging"
                          name="enabledOAuthAuditLogging"
                          type="checkbox"
                          onChange={formik.handleChange}
                          defaultChecked={
                            formik.values.enabledOAuthAuditLogging
                          }
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row></FormGroup>
                    <GluuFooter />
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
  }
}
export default connect(mapStateToProps)(LoggingPage)
