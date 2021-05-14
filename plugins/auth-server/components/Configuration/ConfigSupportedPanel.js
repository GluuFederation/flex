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
      <Col sm={12}>
        <Accordion className="mb-12 text-white">
          <Accordion.Header className="d-flex bg-primary text-white align-items-center h6">
            Default supported
            <Accordion.Indicator className="ml-auto" />
          </Accordion.Header>
          &nbsp;
          <Accordion.Body>
            <GluuTypeAheadWithAdd
              name="responseTypesSupported"
              label="Response Types Supported"
              value={configuration.responseTypesSupported || []}
              options={configuration.responseTypesSupported}
              validator={validator}
              inputId={responseTypesSupported}
            ></GluuTypeAheadWithAdd>
          </Accordion.Body>
        </Accordion>
      </Col>
    </FormGroup>
  )
}

export default ConfigSupportedPanel
