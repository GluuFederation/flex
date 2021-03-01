import React, { useEffect } from 'react'
import BlockUi from 'react-block-ui'
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
import { getSmtpConfig } from '../../../redux/actions/SmtpActions'
function SmtpPage({ smtp, dispatch, loading }) {
  useEffect(() => {
    dispatch(getSmtpConfig())
  }, [])
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
                      defaultChecked={smtp.requires_authentication}
                    />
                  </Col>
                  <GluuLabel label="Required Authentication" size={3} />
                  <Col sm={1}>
                    <Input
                      id="requires_ssl"
                      name="requires_ssl"
                      type="checkbox"
                      defaultChecked={smtp.requires_ssl}
                    />
                  </Col>
                  <GluuLabel label="Trusted Host ?" size={3} />
                  <Col sm={1}>
                    <Input
                      id="trust_host"
                      name="trust_host"
                      type="checkbox"
                      defaultChecked={smtp.trust_host}
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
      </BlockUi>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    smtp: state.smtpReducer.smtp,
    loading: state.smtpReducer.loading,
  }
}

export default connect(mapStateToProps)(SmtpPage)
