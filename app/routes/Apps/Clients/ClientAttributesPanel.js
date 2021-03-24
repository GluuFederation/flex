import React from 'react'
import { Container, FormGroup, Label } from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'

function ClientAttributesPanel({ client, formik }) {
  const keys = Object.keys(client.attributes)
  if (!keys) {
    return <Container></Container>
  } else {
    return (
      <Container>
        {keys.map((key, index) => (
          <FormGroup row key={index}>
            <GluuLabel label={key} size={8} />
            <GluuLabel label={String(keys[key])} size={4} />
          </FormGroup>
        ))}
      </Container>
    )
  }
}

export default ClientAttributesPanel
