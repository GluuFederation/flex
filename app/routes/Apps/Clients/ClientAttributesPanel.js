import React from 'react'
import { Container, Col, Row, Label } from '../../../components'
import GluuFormDetailRow from '../Gluu/GluuFormDetailRow'

function ClientAttributesPanel({ client, formik }) {
  function readValue(keys, key) {
    let res = String(keys[key])
    if (res === 'undefined') {
      return 'false'
    }
    return res
  }
  if (client.attributes) {
    const keys = Object.keys(client.attributes)
    return (
      <Container>
        {keys.map((key, index) => (
          <Row key={index}>
            <Col sm={12}>
              <GluuFormDetailRow label={key} value={readValue(keys, key)} />
            </Col>
          </Row>
        ))}
      </Container>
    )
  } else {
    return <Container></Container>
  }
}

export default ClientAttributesPanel
