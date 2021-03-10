import React from 'react'
import { Col, Container, FormGroup, Label, Input } from '../../../components'
const ClientBasicPanel = ({ client, formik }) => {
  return (
    <Container>
      <FormGroup row>
        <Label for="name" sm={3}>
          Client Name
        </Label>
        <Col sm={9}>
          <Input
            placeholder="Enter the client name"
            id="clientName"
            name="clientName"
            defaultValue={client.displayName}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="name" sm={3}>
          Display Name
        </Label>
        <Col sm={9}>
          <Input
            placeholder="Enter the client displayName"
            id="displayName"
            name="displayName"
            defaultValue={client.displayName}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
    </Container>
  )
}

export default ClientBasicPanel
