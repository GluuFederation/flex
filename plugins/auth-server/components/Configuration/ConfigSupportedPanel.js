import React from 'react'
import { Col, FormGroup, Accordion } from '../../../../app/components'
import GluuInput from '../../../../app/routes/Apps/Gluu/GluuInput'
import GluuBooleanBox from '../../../../app/routes/Apps/Gluu/GluuBooleanInput'
import GluuTypeAheadWithAdd from '../../../../app/routes/Apps/Gluu/GluuTypeAheadWithAdd'

function ConfigSupportedPanel({ configuration }) {
  const responseTypesSupported = 'responseTypesSupported'
  function validator(uri) {
    return !uri
  }
  return (
    <FormGroup row>
      <GluuTypeAheadWithAdd
        name="responseTypesSupported"
        label="Response Types Supported"
        value={configuration.responseTypesSupported || []}
        options={configuration.responseTypesSupported}
        validator={validator}
        inputId={responseTypesSupported}
      ></GluuTypeAheadWithAdd>
    </FormGroup>
  )
}

export default ConfigSupportedPanel
