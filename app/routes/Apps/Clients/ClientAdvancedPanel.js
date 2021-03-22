import React from 'react'
import { Col, Container, FormGroup, Label, Input } from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'

function ClientAdvancedPanel({ client, formik }) {
  const redirectUris = []
  return (
    <Container>
      <FormGroup row>
        <GluuLabel label="Access Token as JWT" size={3} />
        <Col sm={1}>
          <Input
            id="accessTokenAsJwt"
            name="accessTokenAsJwt"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.accessTokenAsJwt}
          />
        </Col>
        <GluuLabel label="Require AuthTime" size={3} />
        <Col sm={1}>
          <Input
            id="requireAuthTime"
            name="requireAuthTime"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.requireAuthTime}
          />
        </Col>
        <GluuLabel label="Rpt As Jwt" size={3} />
        <Col sm={1}>
          <Input
            id="rptAsJwt"
            name="rptAsJwt"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.rptAsJwt}
          />
        </Col>
      </FormGroup>
    </Container>
  )
}

export default ClientAdvancedPanel
