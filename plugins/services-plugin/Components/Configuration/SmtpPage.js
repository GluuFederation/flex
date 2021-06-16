import React, { useEffect } from 'react'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import {
  Badge,
  Col,
  Form,
  FormGroup,
  Container,
  Input,
  Card,
  CardBody,
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
import { connect } from 'react-redux'
import {
  getSmtpConfig,
  editSmtp,
  testSmtp,
} from '../../redux/actions/SmtpActions'
import {
  hasPermission,
  SMTP_READ,
  SMTP_WRITE,
} from '../../../../app/utils/PermChecker'
import { useTranslation } from 'react-i18next'

function SmtpPage({ smtp, testStatus, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  useEffect(() => {
    dispatch(getSmtpConfig())
  }, [])

  function checkSmtpConfig() {
    dispatch(testSmtp())
  }
  const initialValues = {
    host: smtp.host,
    port: smtp.port,
    from_name: smtp.from_name,
    from_email_address: smtp.from_email_address,
    user_name: smtp.user_name,
    passord: smtp.password,
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
          message={t("Performing the request, please wait!")}
        >
          <Card>
            <CardBody>
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  const opts = {}
                  const smtpData = JSON.stringify(values)
                  opts['smtpConfiguration'] = JSON.parse(smtpData)
                  dispatch(editSmtp(opts))
                }}
              >
                {(formik) => (
                  <Form onSubmit={formik.handleSubmit}>
                    {(testStatus) => (
                      <FormGroup row>
                        <GluuLabel label={t("Smtp Test Status")} size={4} />
                        <Col sm={8}>
                          <Badge color="primary">
                            {testStatus.service} {testStatus.status}
                          </Badge>
                        </Col>
                      </FormGroup>
                    )}

                    <FormGroup row>
                      <GluuLabel label={t("Host Name")} required />
                      <Col sm={9}>
                        <Input
                          placeholder={t("Enter the SMTP server hostname")}
                          id="host"
                          name="host"
                          onChange={formik.handleChange}
                          defaultValue={smtp.host}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label={t("Sender Name")} required />
                      <Col sm={9}>
                        <Input
                          placeholder={t("Enter the sender name")}
                          id="from_name"
                          name="from_name"
                          onChange={formik.handleChange}
                          defaultValue={smtp.from_name}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label={t("Sender Email")} required />
                      <Col sm={9}>
                        <Input
                          type="email"
                          placeholder={t("Enter the sender email")}
                          id="from_email_address"
                          name="from_email_address"
                          onChange={formik.handleChange}
                          defaultValue={smtp.from_email_address}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label={t("SMTP User Name")} required />
                      <Col sm={9}>
                        <Input
                          placeholder={t("Enter the SMTP user name")}
                          id="user_name"
                          name="user_name"
                          onChange={formik.handleChange}
                          defaultValue={smtp.user_name}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label={t("SMTP User Password")} required />
                      <Col sm={9}>
                        <Input
                          type="password"
                          placeholder={t("Enter the SMTP user password")}
                          id="password"
                          name="password"
                          onChange={formik.handleChange}
                          defaultValue={smtp.password}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label={t("Required Authentication")} size={3} />
                      <Col sm={1}>
                        <Input
                          id="requires_authentication"
                          name="requires_authentication"
                          type="checkbox"
                          onChange={formik.handleChange}
                          defaultChecked={smtp.requires_authentication}
                        />
                      </Col>
                      <GluuLabel label={t("Required SSL")} size={3} />
                      <Col sm={1}>
                        <Input
                          id="requires_ssl"
                          name="requires_ssl"
                          type="checkbox"
                          onChange={formik.handleChange}
                          defaultChecked={smtp.requires_ssl}
                        />
                      </Col>
                      <GluuLabel label={t("Trusted Host ?")} size={3} />
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
                      <GluuLabel label={t("SMTP server port")} required />
                      <Col sm={9}>
                        <Input
                          type="number"
                          placeholder={t("Enter the SMTP server port")}
                          id="port"
                          name="port"
                          onChange={formik.handleChange}
                          defaultValue={smtp.port}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row></FormGroup>
                    {hasPermission(permissions, SMTP_WRITE) && (
                      <GluuFooter
                        extraLabel={t("Test Config")}
                        extraOnClick={checkSmtpConfig}
                      />
                    )}
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
    testStatus: state.smtpReducer.testStatus,
    permissions: state.authReducer.permissions,
    loading: state.smtpReducer.loading,
  }
}

export default connect(mapStateToProps)(SmtpPage)
