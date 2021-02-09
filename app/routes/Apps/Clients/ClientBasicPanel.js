import React from "react";
import { Col, Container, FormGroup, Label, Input } from "../../../components";
const ClientBasicPanel = () => {
  return (
    <Container>
      <FormGroup row>
        <Label for="name" sm={3}>
          Name
        </Label>
        <Col sm={9}>
          <Input placeholder="Enter the client name" id="name" name="name" />
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
          />
        </Col>
      </FormGroup>
    </Container>
  );
};

export default ClientBasicPanel;
