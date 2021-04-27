import React from 'react'
import { Col, FormGroup, Accordion } from './../../../components'
import GluuInput from '../Gluu/GluuInput'
import GluuBooleanBox from '../Gluu/GluuBooleanInput'

function ConfigBasicPanel({ configuration }) {
  const lSize = 6
  return (
    <FormGroup row>
      <Col sm={12}>
        <Accordion className="mb-12 text-white">
          <Accordion.Header className="d-flex bg-primary text-white align-items-center h6">
            Basic config
            <Accordion.Indicator className="ml-auto" />
          </Accordion.Header>
          &nbsp;
          <Accordion.Body>
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
              label="defaultSubjectType"
              value={configuration.defaultSubjectType}
            />
            <GluuInput
              id="serviceDocumentation"
              lsize={lSize}
              rsize={lSize}
              label="Service Documentation"
              value={configuration.serviceDocumentation}
            />
          </Accordion.Body>
        </Accordion>
      </Col>
    </FormGroup>
  )
}

export default ConfigBasicPanel
