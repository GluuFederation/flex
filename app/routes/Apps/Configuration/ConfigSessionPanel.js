import React from 'react'
import { Col, FormGroup, Accordion } from '../../../components'
import GluuInput from '../Gluu/GluuInput'
import GluuBooleanBox from '../Gluu/GluuBooleanInput'

function ConfigSessionPanel({ configuration }) {
  const lSize = 6
  return (
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
              lsize={lSize}
              label="SessionId Enabled"
              value={configuration.sessionIdEnabled}
            />
            <GluuBooleanBox
              id="sessionIdPersistOnPromptNone"
              lsize={lSize}
              label="SessionId Persist On Prompt None"
              value={configuration.sessionIdPersistOnPromptNone}
            />
            <GluuBooleanBox
              id="sessionIdRequestParameterEnabled"
              lsize={lSize}
              label="SessionId Request Parameter Enabled"
              value={configuration.sessionIdRequestParameterEnabled}
            />
            <GluuBooleanBox
              id="changeSessionIdOnAuthentication"
              lsize={lSize}
              label="Change SessionId On Authentication"
              value={configuration.changeSessionIdOnAuthentication}
            />
            <GluuBooleanBox
              id="sessionIdPersistInCache"
              lsize={lSize}
              label="SessionId Persist In Cache"
              value={configuration.sessionIdPersistInCache}
            />
            <GluuInput
              id="sessionIdUnusedLifetime"
              lsize={lSize}
              rsize={lSize}
              type="number"
              label="SessionId Unused Lifetime"
              value={configuration.sessionIdUnusedLifetime}
            />
            <GluuInput
              id="sessionIdUnauthenticatedUnusedLifetime"
              lsize={lSize}
              rsize={lSize}
              type="number"
              label="SessionId Unauthenticated Unused Lifetime"
              value={configuration.sessionIdUnauthenticatedUnusedLifetime}
            />
            <GluuInput
              id="sessionIdLifetime"
              lsize={lSize}
              rsize={lSize}
              type="number"
              label="SessionId Lifetime"
              value={configuration.sessionIdLifetime}
            />
            <GluuInput
              id="serverSessionIdLifetime"
              lsize={lSize}
              rsize={lSize}
              type="number"
              label="Server SessionId Lifetime"
              value={configuration.serverSessionIdLifetime}
            />
          </Accordion.Body>
        </Accordion>
      </Col>
    </FormGroup>
  )
}

export default ConfigSessionPanel
