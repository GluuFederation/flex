import React from 'react'
import { FormGroup } from '../../../../app/components'
import GluuInput from '../../../../app/routes/Apps/Gluu/GluuInput'
import GluuBooleanBox from '../../../../app/routes/Apps/Gluu/GluuBooleanInput'

function ConfigEndpoints({ configuration }) {
  const lSize = 6
  return (
    <FormGroup>
      <GluuInput
        id="issuer"
        lsize={lSize}
        rsize={lSize}
        label="Issuer"
        value={configuration.issuer}
      />
      <GluuInput
        id="baseEndpoint"
        lsize={lSize}
        rsize={lSize}
        label="Base Endpoint"
        value={configuration.baseEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="authorizationEndpoint"
        label="Authorization Endpoint"
        value={configuration.authorizationEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="tokenEndpoint"
        label="Token Endpoint"
        value={configuration.tokenEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="tokenRevocationEndpoint"
        label="Token Revocation Endpoint"
        value={configuration.tokenRevocationEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="userInfoEndpoint"
        label="User Info Endpoint"
        value={configuration.userInfoEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="clientInfoEndpoint"
        label="Client Info Endpoint"
        value={configuration.clientInfoEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="endSessionEndpoint"
        label="End Session Endpoint"
        value={configuration.endSessionEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="registrationEndpoint"
        label="Registration Endpoint"
        value={configuration.registrationEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="openIdDiscoveryEndpoint"
        label="OpenId Discovery Endpoint"
        value={configuration.openIdDiscoveryEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="openIdConfigurationEndpoint"
        label="OpenId Configuration Endpoint"
        value={configuration.openIdConfigurationEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="idGenerationEndpoint"
        label="Id Generation Endpoint"
        value={configuration.idGenerationEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="introspectionEndpoint"
        label="Introspection Endpoint"
        value={configuration.introspectionEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="deviceAuthzEndpoint"
        label="D eviceAuthz Endpoint"
        value={configuration.deviceAuthzEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="umaConfigurationEndpoint"
        label="Uma Configuration Endpoint"
        value={configuration.umaConfigurationEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="oxElevenGenerateKeyEndpoint"
        label="oxEleven Generate Key Endpoint"
        value={configuration.oxElevenGenerateKeyEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="oxElevenSignEndpoint"
        label="oxEleven Sign Endpoint"
        value={configuration.oxElevenSignEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="oxElevenVerifySignatureEndpoint"
        label="oxEleven Verify Signature Endpoint"
        value={configuration.oxElevenVerifySignatureEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="oxElevenDeleteKeyEndpoint"
        label="oxEleven Delete Key Endpoint"
        value={configuration.oxElevenDeleteKeyEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="backchannelAuthenticationEndpoint"
        label="Back Channel Authentication Endpoint"
        value={configuration.backchannelAuthenticationEndpoint}
      />
      <GluuInput
        lsize={lSize}
        rsize={lSize}
        id="backchannelDeviceRegistrationEndpoint"
        label="Back Channel Device Registration Endpoint"
        value={configuration.backchannelDeviceRegistrationEndpoint}
      />
    </FormGroup>
  )
}

export default ConfigEndpoints
