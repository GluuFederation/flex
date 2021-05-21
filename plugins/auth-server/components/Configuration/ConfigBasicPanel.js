import React from 'react'
import {FormGroup} from '../../../../app/components'
import GluuInput from '../../../../app/routes/Apps/Gluu/GluuInput'
import GluuBooleanBox from '../../../../app/routes/Apps/Gluu/GluuBooleanInput'

function ConfigBasicPanel({ configuration }) {
  const lSize = 6
  return (
    <FormGroup>
      <GluuInput
        id="checkSessionIFrame"
        lsize={lSize}
        rsize={lSize}
        label="Check Session IFrame"
        value={configuration.checkSessionIFrame}
      />
      <GluuInput
        id="jwksUri"
        lsize={lSize}
        rsize={lSize}
        label="Jwks Uri"
        value={configuration.jwksUri}
      />
      <GluuInput
        id="sectorIdentifierCacheLifetimeInMinutes"
        lsize={lSize}
        rsize={lSize}
        type="number"
        label="Sector Identifier Cache Lifetime In Minutes"
        value={configuration.sectorIdentifierCacheLifetimeInMinutes}
      />
      <GluuInput
        id="spontaneousScopeLifetime"
        lsize={lSize}
        rsize={lSize}
        type="number"
        label="Spontaneous Scope Lifetime"
        value={configuration.spontaneousScopeLifetime}
      />
      <GluuInput
        id="openidSubAttribute"
        lsize={lSize}
        rsize={lSize}
        label="openidSubAttribute"
        value={configuration.openidSubAttribute}
      />
      <GluuInput
        id="defaultSubjectType"
        lsize={lSize}
        rsize={lSize}
        label="Default Subject Type"
        value={configuration.defaultSubjectType}
      />
      <GluuBooleanBox
        id="dcrSignatureValidationEnabled"
        lsize={lSize}
        rsize={lSize}
        label="Dcr Signature Validation Enabled"
        value={configuration.dcrSignatureValidationEnabled}
      />
      <GluuBooleanBox
        id="dcrAuthorizationWithClientCredentials"
        lsize={lSize}
        rsize={lSize}
        label="Dcr Authorization With Client Credentials"
        value={configuration.dcrAuthorizationWithClientCredentials}
      />
      <GluuBooleanBox
        id="dcrSkipSignatureValidation"
        lsize={lSize}
        rsize={lSize}
        label="Dcr Skip Signature Validation"
        value={configuration.dcrSkipSignatureValidation}
      />
       <GluuBooleanBox
        id="httpLoggingEnabled"
        lsize={lSize}
        rsize={lSize}
        label="Http Logging Enabled"
        value={configuration.httpLoggingEnabled}
      />
      <GluuInput
        id="serviceDocumentation"
        lsize={lSize}
        rsize={lSize}
        label="Service Documentation"
        value={configuration.serviceDocumentation}
      />
      <GluuBooleanBox
        id="statEnabled"
        lsize={lSize}
        rsize={lSize}
        label="Stat Enabled"
        value={configuration.statEnabled}
      />
      <GluuInput
        id="statTimerIntervalInSeconds"
        lsize={lSize}
        rsize={lSize}
        label="Stat Timer Interval In Seconds"
        value={configuration.statTimerIntervalInSeconds}
      />
      <GluuInput
        id="statWebServiceIntervalLimitInSeconds"
        lsize={lSize}
        rsize={lSize}
        label="Stat Web Service Interval Limit In Seconds"
        value={configuration.statWebServiceIntervalLimitInSeconds}
      />
       <GluuInput
        id="statWebServiceIntervalLimitInSeconds"
        lsize={lSize}
        rsize={lSize}
        label="Stat Web Service Interval Limit In Seconds"
        value={configuration.statWebServiceIntervalLimitInSeconds}
      />
    </FormGroup>
  )
}

export default ConfigBasicPanel
