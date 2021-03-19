import React, { useEffect, useState } from 'react'
import {
  hasPermission,
  FIDO_READ,
  FIDO_WRITE,
} from '../../../utils/PermChecker'
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

function Fido2Page({ fido, loading, permissions, dispatch }) {
  useEffect(() => {
    dispatch(getFidoConfig())
  }, [])
  const initialValues = {
    authenticatorCertsFolder: fido.fido2Configuration.authenticatorCertsFolder,
    mdsCertsFolder: fido.fido2Configuration.mdsCertsFolder,
    mdsTocsFolder: fido.fido2Configuration.mdsTocsFolder,
    serverMetadataFolder: fido.fido2Configuration.serverMetadataFolder,
    requestedCredentialTypes: fido.fido2Configuration.requestedCredentialTypes,
    requestedParties: fido.fido2Configuration.requestedParties,
    userAutoEnrollment: fido.fido2Configuration.userAutoEnrollment,
    unfinishedRequestExpiration:
      fido.fido2Configuration.unfinishedRequestExpiration,
    authenticationHistoryExpiration:
      fido.fido2Configuration.authenticationHistoryExpiration,
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
                onSubmit={(values) => {
                  const opts = {}
                  var dataString = JSON.stringify(values)
                  var subObject = JSON.parse(dataString)
                  fido.fido2Configuration = subObject
                  opts['jansFido2DynConfiguration'] = fido
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
                          defaultValue={
                            fido.fido2Configuration.authenticatorCertsFolder
                          }
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
                          defaultValue={fido.fido2Configuration.mdsCertsFolder}
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
                          defaultValue={fido.fido2Configuration.mdsTocsFolder}
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
                          defaultValue={
                            fido.fido2Configuration.serverMetadataFolder
                          }
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
                          defaultChecked={
                            fido.fido2Configuration.userAutoEnrollment
                          }
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
                          defaultValue={
                            fido.fido2Configuration.unfinishedRequestExpiration
                          }
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
                            fido.fido2Configuration
                              .authenticationHistoryExpiration
                          }
                        />
                      </Col>
                    </FormGroup>
                    {fido.fido2Configuration.requestedCredentialTypes && (
                      <FormGroup row>
                        <GluuLabel
                          label="Requested Credential Types"
                          required
                          size={4}
                        />
                        <Col sm={8}>
                          {fido.fido2Configuration.requestedCredentialTypes.map(
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
                    {fido.fido2Configuration.requestedParties && (
                      <FormGroup row>
                        <GluuLabel
                          label="Requested Parties"
                          required
                          size={4}
                        />
                        <Col sm={8}>
                          {fido.fido2Configuration.requestedParties.map(
                            (item, index) => (
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
                            ),
                          )}
                        </Col>
                      </FormGroup>
                    )}
                    <FormGroup row></FormGroup>
                    {hasPermission(permissions, FIDO_WRITE) && <GluuFooter />}
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
    fido: state.fidoReducer.fido,
    loading: state.fidoReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(Fido2Page)
