import React from "react";
import { Col, Container, FormGroup, Label, Input } from "../../../components";

function ClientEncryptionPanel() {
  return (
    <Container>
      <FormGroup row>
        <Label for="name" sm={3}>
          Grant Type
        </Label>
        <Col sm={9}>
          <Input
            placeholder="Enter the client grant type"
            id="grant"
            name="grant"
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="name" sm={3}>
          Redirect uri
        </Label>
        <Col sm={9}>
          <Input
            placeholder="Enter the client redirect uri"
            id="uri"
            name="uri"
          />
        </Col>
      </FormGroup>
    </Container>
  );
}

export default ClientEncryptionPanel;
