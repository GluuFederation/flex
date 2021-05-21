import React from 'react'
import { Col, FormGroup, Accordion } from '../../../../app/components'
import GluuInput from '../../../../app/routes/Apps/Gluu/GluuInput'
import GluuBooleanBox from '../../../../app/routes/Apps/Gluu/GluuBooleanInput'

function ConfigUmaPanel({ configuration }) {
  const lSize = 6
  return (
    <FormGroup>
      <GluuInput
        id="umaRptLifetime"
        lsize={lSize}
        rsize={lSize}
        type="number"
        label="Uma Rpt Lifetime"
        value={configuration.umaRptLifetime}
      />
      <GluuInput
        id="umaTicketLifetime"
        lsize={lSize}
        rsize={lSize}
        type="number"
        label="Uma Ticket Lifetime"
        value={configuration.umaTicketLifetime}
      />
      <GluuInput
        id="umaPctLifetime"
        lsize={lSize}
        rsize={lSize}
        type="number"
        label="Uma Pct Lifetime"
        value={configuration.umaPctLifetime}
      />
      <GluuInput
        id="umaResourceLifetime"
        lsize={lSize}
        rsize={lSize}
        type="number"
        label="Uma Resource Lifetime"
        value={configuration.umaResourceLifetime}
      />
      <GluuBooleanBox
        id="umaRptAsJwt"
        lsize={lSize}
        label="Uma Rpt As Jwt"
        value={configuration.umaRptAsJwt}
      />
      <GluuBooleanBox
        id="umaAddScopesAutomatically"
        lsize={lSize}
        label="Uma Add Scopes Automatically"
        value={configuration.umaAddScopesAutomatically}
      />
      <GluuBooleanBox
        id="umaValidateClaimToken"
        lsize={lSize}
        label="Uma Validate Claim Token"
        value={configuration.umaValidateClaimToken}
      />
      <GluuBooleanBox
        id="umaGrantAccessIfNoPolicies"
        lsize={lSize}
        label="Uma Grant Access If No Policies"
        value={configuration.umaGrantAccessIfNoPolicies}
      />
      <GluuBooleanBox
        id="umaRestrictResourceToAssociatedClient"
        lsize={lSize}
        label="Uma Restrict Resource To Associated Client"
        value={configuration.umaRestrictResourceToAssociatedClient}
      />
    </FormGroup>
  )
}

export default ConfigUmaPanel
