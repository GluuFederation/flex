import React, { useEffect, useState } from 'react'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
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
import { getSmtpConfig, editSmtp } from '../../../redux/actions/SmtpActions'
function SmtpPage({ smtp, permissions, loading, dispatch }) {
  useEffect(() => {
    dispatch(getSmtpConfig())
  }, [])

  const initialValues = {
    host: smtp.host,
    port: smtp.port,
    from_name: smtp.from_name,
    from_email_address: smtp.from_email_address,
    user_name: smtp.user_name,
    password: smtp.password,
    requires_ssl: smtp.requires_ssl,
    requires_authentication: smtp.requires_authentication,
    trust_host: smtp.trust_host,
  }
  return (
    <React.Fragment>
      <Container>
        <BlockUi
          tag="div"
          blocking={loading}
          keepInView={true}
          renderChildren={true}
          message={'Performing the request, please wait!'}
        >
          <Card>
            <CardBody>
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  const opts = {}
                  opts['smtpConfiguration'] = JSON.stringify(values)
                  dispatch(editSmtp(opts))
                }}
              >
                {(formik) => (
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup row>
                      <GluuLabel label="Host Name" required />
                      <Col sm={9}>
                        <Input
                          placeholder="Enter the SMTP server hostname"
                          id="host"
                          name="host"
                          onChange={formik.handleChange}
                          defaultValue={smtp.host}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="Sender Name" required />
                      <Col sm={9}>
                        <Input
                          placeholder="Enter the sender name"
                          id="from_name"
                          name="from_name"
                          onChange={formik.handleChange}
                          defaultValue={smtp.from_name}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="Sender Email" required />
                      <Col sm={9}>
                        <Input
                          type="email"
                          placeholder="Enter the sender email"
                          id="from_email_address"
                          name="from_email_address"
                          onChange={formik.handleChange}
                          defaultValue={smtp.from_email_address}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="SMTP User Name" required />
                      <Col sm={9}>
                        <Input
                          placeholder="Enter the SMTP user name"
                          id="user_name"
                          name="user_name"
                          onChange={formik.handleChange}
                          defaultValue={smtp.user_name}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="SMTP User Password" required />
                      <Col sm={9}>
                        <Input
                          type="password"
                          placeholder="Enter the SMTP user password"
                          id="password"
                          name="password"
                          onChange={formik.handleChange}
                          defaultValue={smtp.password}
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
                          onChange={formik.handleChange}
                          defaultChecked={smtp.requires_authentication}
                        />
                      </Col>
                      <GluuLabel label="Required SSL" size={3} />
                      <Col sm={1}>
                        <Input
                          id="requires_ssl"
                          name="requires_ssl"
                          type="checkbox"
                          onChange={formik.handleChange}
                          defaultChecked={smtp.requires_ssl}
                        />
                      </Col>
                      <GluuLabel label="Trusted Host ?" size={3} />
                      <Col sm={1}>
                        <Input
                          id="trust_host"
                          name="trust_host"
                          type="checkbox"
                          onChange={formik.handleChange}
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
                          onChange={formik.handleChange}
                          defaultValue={smtp.port}
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
        </BlockUi>
      </Container>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    smtp: state.smtpReducer.smtp,
    permissions: state.authReducer.permissions,
    loading: state.smtpReducer.loading,
  }
}

export default connect(mapStateToProps)(SmtpPage)
