import React from 'react'
import { Col, FormGroup, Accordion } from './../../../components'
import GluuInput from '../Gluu/GluuInput'
import GluuBooleanBox from '../Gluu/GluuBooleanInput'

function ConfigUmaPanel({ configuration }) {
  const lSize = 6
  return (
    <FormGroup row>
      <Col sm={12}>
        <Accordion className="mb-12 text-white">
          <Accordion.Header className="d-flex bg-primary text-white align-items-center h6">
            Uma based settings
            <Accordion.Indicator className="ml-auto" />
          </Accordion.Header>
          &nbsp;
          <Accordion.Body>
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
          </Accordion.Body>
        </Accordion>
      </Col>
    </FormGroup>
  )
}

export default ConfigUmaPanel
