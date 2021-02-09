import React from "react";
import { Col, Container, FormGroup, Label, Input } from "../../../components";
function ClientAdvancedPanel() {
  return (
    <Container>
      <FormGroup row>
        <Label for="name" sm={3}>
          Client Type
        </Label>
        <Col sm={9}>
          <Input placeholder="Enter the client type" id="type" name="type" />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="name" sm={3}>
          Description
        </Label>
        <Col sm={9}>
          <Input
            placeholder="Enter the client description"
            id="description"
            name="description"
          />
        </Col>
      </FormGroup>
    </Container>
  );
}

export default ClientAdvancedPanel;
