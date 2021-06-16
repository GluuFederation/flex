import React, { useState } from 'react'
import { FormGroup, Label, Col } from '../../../components'
import Toggle from 'react-toggle'
import { useTranslation } from 'react-i18next'

function GluuSecretDetail({ label, value }) {
  const { t } = useTranslation()
  const [up, setUp] = useState(false)
  function handleSecret() {
    setUp(!up)
  }

  return (
    <FormGroup row>
      <Label for="input" sm={2}>
        {t(label)}:
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
