import React, { useEffect } from 'react'
import {
  Form,
  FormGroup,
  Container,
  Card,
  Divider,
  Badge,
  Col,
  Input,
  CardBody,
} from './../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuFooter from '../Gluu/GluuFooter'
import { connect } from 'react-redux'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import {
  getFidoConfig,
  editFidoConfig,
} from '../../../redux/actions/FidoActions'

function Fido2Page({ fido, dispatch, loading }) {
  console.log('**********' + JSON.stringify(fido))
  useEffect(() => {
    dispatch(getFidoConfig())
  }, [])
  const initialValues = {
    authenticatorCertsFolder: fido.authenticatorCertsFolder,
    mdsCertsFolder: fido.mdsCertsFolder,
    mdsTocsFolder: fido.mdsTocsFolder,
    serverMetadataFolder: fido.serverMetadataFolder,
    requestedCredentialTypes: fido.requestedCredentialTypes,
    requestedParties: fido.requestedParties,
    userAutoEnrollment: fido.userAutoEnrollment,
    unfinishedRequestExpiration: fido.unfinishedRequestExpiration,
    authenticationHistoryExpiration: fido.authenticationHistoryExpiration,
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
                  opts['jansFido2DynConfiguration'] = JSON.stringify(values)
                  dispatch(editFidoConfig(opts))
                }}
              >
                {(formik) => (
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup row>
                      <GluuLabel
                        label="Authenticator Certs Folder"
                        required
                        size={4}
                      />
                      <Col sm={8}>
                        <Input
                          id="authenticatorCertsFolder"
                          name="authenticatorCertsFolder"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.authenticatorCertsFolder}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="Mds Certs Folder" required size={4} />
                      <Col sm={8}>
                        <Input
                          id="mdsCertsFolder"
                          name="mdsCertsFolder"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.mdsCertsFolder}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="Mds to Toc Folder" required size={4} />
                      <Col sm={8}>
                        <Input
                          id="mdsTocsFolder"
                          name="mdsTocsFolder"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.mdsTocsFolder}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel
                        label="Server Metadata Folder"
                        required
                        size={4}
                      />
                      <Col sm={8}>
                        <Input
                          id="serverMetadataFolder"
                          name="serverMetadataFolder"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.serverMetadataFolder}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <GluuLabel label="Auto Enroll User?" size={2} />
                      <Col sm={2}>
                        <Input
                          id="userAutoEnrollment"
                          name="userAutoEnrollment"
                          onChange={formik.handleChange}
                          type="checkbox"
                          defaultChecked={formik.values.userAutoEnrollment}
                        />
                      </Col>
                      <GluuLabel
                        label="Unfinished Request Expiration"
                        size={2}
                      />
                      <Col sm={2}>
                        <Input
                          id="unfinishedRequestExpiration"
                          name="unfinishedRequestExpiration"
                          type="number"
                          onChange={formik.handleChange}
                          defaultValue={fido.unfinishedRequestExpiration}
                        />
                      </Col>
                      <GluuLabel
                        label="Authentication History Expiration"
                        size={2}
                      />
                      <Col sm={2}>
                        <Input
                          id="authenticationHistoryExpiration"
                          name="authenticationHistoryExpiration"
                          type="number"
                          onChange={formik.handleChange}
                          defaultValue={
                            formik.values.authenticationHistoryExpiration
                          }
                        />
                      </Col>
                    </FormGroup>
                    {fido.requestedCredentialTypes && (
                      <FormGroup row>
                        <GluuLabel
                          label="Requested Credential Types"
                          required
                          size={4}
                        />
                        <Col sm={8}>
                          {formik.values.requestedCredentialTypes.map(
                            (item, index) => (
                              <Badge key={index} color="primary">
                                {item}
                              </Badge>
                            ),
                          )}
                        </Col>
                      </FormGroup>
                    )}
                    <Divider></Divider>
                    {fido.requestedParties && (
                      <FormGroup row>
                        <GluuLabel
                          label="Requested Parties"
                          required
                          size={4}
                        />
                        <Col sm={8}>
                          {formik.values.requestedParties.map((item, index) => (
                            <FormGroup row key={index}>
                              <GluuLabel label="Name" size={2} />
                              <Col sm={4} key={index}>
                                <Input
                                  id="Name"
                                  key={index}
                                  name="name"
                                  type="text"
                                  onChange={formik.handleChange}
                                  defaultValue={item.name}
                                />
                              </Col>
                              <GluuLabel label="Domains" size={3} />
                              <Col sm={3}>
                                {item.domains.map((domain, key) => (
                                  <Badge key={key} color="primary">
                                    {domain}
                                  </Badge>
                                ))}
                              </Col>
                            </FormGroup>
                          ))}
                        </Col>
                      </FormGroup>
                    )}
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
    fido: state.fidoReducer.fido.fido2Configuration,
    loading: state.fidoReducer.loading,
  }
}
export default connect(mapStateToProps)(Fido2Page)
