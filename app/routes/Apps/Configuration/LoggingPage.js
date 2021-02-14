import React from 'react'
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
function LoggingPage(loggingData) {
  const logging = {
    loggingLevel: 'TRACE',
    loggingLayout: 'text',
    httpLoggingEnabled: false,
    disableJdkLogger: true,
    enabledOAuthAuditLogging: false,
  }
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              <FormGroup row>
                <GluuLabel label="Logging level" required size={4} />
                <Col sm={8}>
                  <Input
                    placeholder="Enter logging level."
                    id="loggingLevel"
                    name="loggingLevel"
                    defaultValue={logging.loggingLevel}
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
                    defaultValue={logging.loggingLayout}
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
                    defaultChecked={logging.httpLoggingEnabled}
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
                    defaultChecked={logging.disableJdkLogger}
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
                    defaultChecked={logging.enabledOAuthAuditLogging}
                  />
                </Col>
              </FormGroup>
              <FormGroup row></FormGroup>
              <GluuFooter />
            </Form>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default LoggingPage
