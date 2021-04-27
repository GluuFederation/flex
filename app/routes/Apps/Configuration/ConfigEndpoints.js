import React from 'react'
import { Col, FormGroup, Accordion } from './../../../components'
import GluuInput from '../Gluu/GluuInput'
import GluuBooleanBox from '../Gluu/GluuBooleanInput'

function ConfigEndpoints({ configuration }) {
  return (
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
              value={configuration.backchannelDeviceRegistrationEndpoint}
            />
          </Accordion.Body>
        </Accordion>
      </Col>
    </FormGroup>
  )
}

export default ConfigEndpoints
