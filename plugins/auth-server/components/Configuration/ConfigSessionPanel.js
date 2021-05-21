import React from 'react'
import { Col, FormGroup, Accordion } from '../../../../app/components'
import GluuInput from '../../../../app/routes/Apps/Gluu/GluuInput'
import GluuBooleanBox from '../../../../app/routes/Apps/Gluu/GluuBooleanInput'

function ConfigSessionPanel({ configuration }) {
  const lSize = 6
  return (
    <FormGroup>
      <GluuBooleanBox
        id="sessionIdEnabled"
        lsize={lSize}
        label="SessionId Enabled"
        value={configuration.sessionIdEnabled}
      />
      <GluuBooleanBox
        id="sessionAsJwt"
        lsize={lSize}
        label="Session As Jwt"
        value={configuration.sessionAsJwt}
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
    </FormGroup>
  )
}

export default ConfigSessionPanel
