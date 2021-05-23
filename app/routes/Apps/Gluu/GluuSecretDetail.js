import React, { useState } from 'react'
import { FormGroup, Label, Col } from '../../../components'
import Toggle from 'react-toggle'

function GluuSecretDetail({ label, value }) {
  const [up, setUp] = useState(false)
  function handleSecret() {
    setUp(!up)
  }

  return (
    <FormGroup row>
      <Label for="input" sm={2}>
        {label}:
      </Label>
      {value !== '-' && (
        <Label for="input" sm={1}>
          <Toggle defaultChecked={false} onChange={handleSecret} />
        </Label>
      )}
      {up && (
        <Col sm={9}>
          <Label for="input" sm={12} style={{ fontWeight: 'bold' }}>
            {value}
          </Label>
        </Col>
      )}
    </FormGroup>
  )
}

export default GluuSecretDetail
