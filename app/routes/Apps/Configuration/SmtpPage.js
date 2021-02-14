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
function SmtpPage({ smtp }) {
  const smtpData = {
    valid: false,
    port: 0,
    requires_ssl: false,
    trust_host: false,
    requires_authentication: false,
  }
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              <FormGroup row>
                <GluuLabel label="Host Name" required />
                <Col sm={9}>
                  <Input
                    placeholder="Enter the SMTP server hostname"
                    id="hostname"
                    name="hostname"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Sender Name" required />
                <Col sm={9}>
                  <Input
                    placeholder="Enter the sender name"
                    id="from"
                    name="from"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Sender Email" required />
                <Col sm={9}>
                  <Input
                    type="email"
                    placeholder="Enter the sender email"
                    id="senderEmail"
                    name="senderEmail"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="SMTP User Name" required />
                <Col sm={9}>
                  <Input
                    placeholder="Enter the SMTP user name"
                    id="userName"
                    name="userName"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="SMTP User Password" required />
                <Col sm={9}>
                  <Input
                    type="password"
                    placeholder="Enter the SMTP user password"
                    id="userPassword"
                    name="userPassword"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Required Authentication" size={3} />
                <Col sm={1}>
                  <Input
                    id="requires_authentication"
                    name="requires_authentication"
                    type="checkbox"
                    defaultChecked={smtpData.requires_authentication}
                  />
                </Col>
                <GluuLabel label="Required Authentication" size={3} />
                <Col sm={1}>
                  <Input
                    id="requires_ssl"
                    name="requires_ssl"
                    type="checkbox"
                    defaultChecked={smtpData.requires_ssl}
                  />
                </Col>
                <GluuLabel label="Trusted Host ?" size={3} />
                <Col sm={1}>
                  <Input
                    id="trust_host"
                    name="trust_host"
                    type="checkbox"
                    defaultChecked={smtpData.trust_host}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="SMTP server port" required />
                <Col sm={9}>
                  <Input
                    type="number"
                    placeholder="Enter the SMTP server port"
                    id="port"
                    name="port"
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

export default SmtpPage
