import React, { useEffect } from 'react'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import {
  Badge,
  Col,
  Form,
  FormGroup,
  Container,
  Accordion,
  Input,
  Card,
  CardText,
  CardBody,
} from './../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuFooter from '../Gluu/GluuFooter'
import GluuInput from '../Gluu/GluuInput'
import GluuBooleanBox from '../Gluu/GluuBooleanInput'
import { connect } from 'react-redux'
import {
  getJsonConfig,
  patchJsonConfig,
} from '../../../redux/actions/JsonConfigActions'

function ConfigPage({ configuration, loading, dispatch }) {
  useEffect(() => {
    dispatch(getJsonConfig())
  }, [])
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              <FormGroup row>
                <Col sm={12}>
                  <Accordion className="mb-12 text-white">
                    <Accordion.Header className="d-flex bg-primary text-white align-items-center h6">
                      OAuth Server endpoints
                      <Accordion.Indicator className="ml-auto" />
                    </Accordion.Header>
                    &nbsp;
                    <Accordion.Body>
                      <GluuInput
                        id="issuer"
                        label="Issuer"
                        value={configuration.issuer}
                      />
                      <GluuInput
                        id="baseEndpoint"
                        label="Base Endpoint"
                        value={configuration.baseEndpoint}
                      />
                      <GluuInput
                        id="authorizationEndpoint"
                        label="Authorization Endpoint"
                        value={configuration.authorizationEndpoint}
                      />
                      <GluuInput
                        id="tokenEndpoint"
                        label="Token Endpoint"
                        value={configuration.tokenEndpoint}
                      />
                      <GluuInput
                        id="tokenRevocationEndpoint"
                        label="Token Revocation Endpoint"
                        value={configuration.tokenRevocationEndpoint}
                      />
                      <GluuInput
                        id="userInfoEndpoint"
                        label="User Info Endpoint"
                        value={configuration.userInfoEndpoint}
                      />
                      <GluuInput
                        id="clientInfoEndpoint"
                        label="Client Info Endpoint"
                        value={configuration.clientInfoEndpoint}
                      />
                      <GluuInput
                        id="endSessionEndpoint"
                        label="End Session Endpoint"
                        value={configuration.endSessionEndpoint}
                      />
                      <GluuInput
                        id="registrationEndpoint"
                        label="Registration Endpoint"
                        value={configuration.registrationEndpoint}
                      />
                      <GluuInput
                        id="openIdDiscoveryEndpoint"
                        label="OpenId Discovery Endpoint"
                        value={configuration.openIdDiscoveryEndpoint}
                      />
                      <GluuInput
                        id="openIdConfigurationEndpoint"
                        label="OpenId Configuration Endpoint"
                        value={configuration.openIdConfigurationEndpoint}
                      />
                      <GluuInput
                        id="idGenerationEndpoint"
                        label="Id Generation Endpoint"
                        value={configuration.idGenerationEndpoint}
                      />
                      <GluuInput
                        id="introspectionEndpoint"
                        label="Introspection Endpoint"
                        value={configuration.introspectionEndpoint}
                      />
                      <GluuInput
                        id="deviceAuthzEndpoint"
                        label="D eviceAuthz Endpoint"
                        value={configuration.deviceAuthzEndpoint}
                      />
                      <GluuInput
                        id="umaConfigurationEndpoint"
                        label="Uma Configuration Endpoint"
                        value={configuration.umaConfigurationEndpoint}
                      />
                      <GluuInput
                        id="oxElevenGenerateKeyEndpoint"
                        label="oxEleven Generate Key Endpoint"
                        value={configuration.oxElevenGenerateKeyEndpoint}
                      />
                      <GluuInput
                        id="oxElevenSignEndpoint"
                        label="oxEleven Sign Endpoint"
                        value={configuration.oxElevenSignEndpoint}
                      />
                      <GluuInput
                        id="oxElevenVerifySignatureEndpoint"
                        label="oxEleven Verify Signature Endpoint"
                        value={configuration.oxElevenVerifySignatureEndpoint}
                      />
                      <GluuInput
                        id="oxElevenDeleteKeyEndpoint"
                        label="oxEleven Delete Key Endpoint"
                        value={configuration.oxElevenDeleteKeyEndpoint}
                      />
                      <GluuInput
                        id="backchannelAuthenticationEndpoint"
                        label="Back Channel Authentication Endpoint"
                        value={configuration.backchannelAuthenticationEndpoint}
                      />
                      <GluuInput
                        id="backchannelDeviceRegistrationEndpoint"
                        label="Back Channel Device Registration Endpoint"
                        value={
                          configuration.backchannelDeviceRegistrationEndpoint
                        }
                      />

                      <GluuInput
                        id="checkSessionIFrame"
                        label="Check Session IFrame"
                        value={configuration.checkSessionIFrame}
                      />
                      <GluuInput
                        id="jwksUri"
                        label="Jwks Uri"
                        value={configuration.jwksUri}
                      />
                    </Accordion.Body>
                  </Accordion>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={12}>
                  <Accordion className="mb-12 text-white">
                    <Accordion.Header className="d-flex bg-primary text-white align-items-center h6">
                      Uma based settings
                      <Accordion.Indicator className="ml-auto" />
                    </Accordion.Header>
                    &nbsp;
                    <Accordion.Body>
                      <GluuBooleanBox
                        id="umaRptAsJwt"
                        label="Uma Rpt As Jwt"
                        value={configuration.umaRptAsJwt}
                      />
                      <GluuInput
                        id="umaRptLifetime"
                        type="number"
                        label="Uma Rpt Lifetime"
                        value={configuration.umaRptLifetime}
                      />
                      <GluuInput
                        id="umaTicketLifetime"
                        type="number"
                        label="Uma Ticket Lifetime"
                        value={configuration.umaTicketLifetime}
                      />
                      <GluuInput
                        id="umaPctLifetime"
                        type="number"
                        label="Uma Pct Lifetime"
                        value={configuration.umaPctLifetime}
                      />
                      <GluuInput
                        id="umaResourceLifetime"
                        type="number"
                        label="Uma Resource Lifetime"
                        value={configuration.umaResourceLifetime}
                      />
                      <GluuBooleanBox
                        id="umaAddScopesAutomatically"
                        label="Uma Add Scopes Automatically"
                        value={configuration.umaAddScopesAutomatically}
                      />
                      <GluuBooleanBox
                        id="umaValidateClaimToken"
                        label="Uma Validate Claim Token"
                        value={configuration.umaValidateClaimToken}
                      />
                      <GluuBooleanBox
                        id="umaGrantAccessIfNoPolicies"
                        label="Uma Grant Access If No Policies"
                        value={configuration.umaGrantAccessIfNoPolicies}
                      />
                      <GluuBooleanBox
                        id="umaRestrictResourceToAssociatedClient"
                        label="Uma Restrict Resource To Associated Client"
                        value={
                          configuration.umaRestrictResourceToAssociatedClient
                        }
                      />
                    </Accordion.Body>
                  </Accordion>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={12}>
                  <Accordion className="mb-12 text-white">
                    <Accordion.Header className="d-flex bg-primary text-white align-items-center h6">
                      Session settings
                      <Accordion.Indicator className="ml-auto" />
                    </Accordion.Header>
                    &nbsp;
                    <Accordion.Body>
                      <GluuBooleanBox
                        id="sessionIdEnabled"
                        label="sessionIdEnabled"
                        value={configuration.sessionIdEnabled}
                      />
                      <GluuBooleanBox
                        id="sessionIdPersistOnPromptNone"
                        label="sessionIdPersistOnPromptNone"
                        value={configuration.sessionIdPersistOnPromptNone}
                      />
                      <GluuBooleanBox
                        id="sessionIdRequestParameterEnabled"
                        label="sessionIdRequestParameterEnabled"
                        value={configuration.sessionIdRequestParameterEnabled}
                      />
                      <GluuBooleanBox
                        id="changeSessionIdOnAuthentication"
                        label="changeSessionIdOnAuthentication"
                        value={configuration.changeSessionIdOnAuthentication}
                      />
                      <GluuBooleanBox
                        id="sessionIdPersistInCache"
                        label="sessionIdPersistInCache"
                        value={configuration.sessionIdPersistInCache}
                      />
                      <GluuInput
                        id="sessionIdUnusedLifetime"
                        type="number"
                        label="sessionIdUnusedLifetime"
                        value={configuration.sessionIdUnusedLifetime}
                      />
                      <GluuInput
                        id="sessionIdUnauthenticatedUnusedLifetime"
                        type="number"
                        label="sessionIdUnauthenticatedUnusedLifetime"
                        value={
                          configuration.sessionIdUnauthenticatedUnusedLifetime
                        }
                      />
                      <GluuInput
                        id="sessionIdLifetime"
                        type="number"
                        label="sessionIdLifetime"
                        value={configuration.sessionIdLifetime}
                      />
                      <GluuInput
                        id="serverSessionIdLifetime"
                        type="number"
                        label="serverSessionIdLifetime"
                        value={configuration.serverSessionIdLifetime}
                      />
                    </Accordion.Body>
                  </Accordion>
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Work in progress" />
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

const mapStateToProps = (state) => {
  return {
    configuration: state.jsonConfigReducer.configuration,
    permissions: state.authReducer.permissions,
    loading: state.smtpReducer.loading,
  }
}

export default connect(mapStateToProps)(ConfigPage)
