import React from "react";
import { Col, Button, FormGroup } from "./../../../components";
function GluuFooter() {
  return (
    <FormGroup row>
      <Col sm={8}></Col>
      <Col sm={1}>
        <Button color="primary" type="submit">Save</Button>
      </Col>
      <Col sm={1}>
        <Button color="secondary" type="reset">
          Cancel
        </Button>
      </Col>
    </FormGroup>
  );
}

export default GluuFooter;
