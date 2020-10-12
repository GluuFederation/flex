import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormCheckbox,
  FormSelect,
  Button
} from "shards-react";

const NamedIdBox = () => {
  const [enableNamedId, setEnableNamedId] = useState(false);
  return (
    <Card>
      <CardBody>
        <Row form>
          <Col sm="12">
            <label htmlFor="sourceAttribute">Source Attribute</label>
            <FormSelect id="sourceAttribute">
              <option>Choose...</option>
              <option>Birthday</option>
              <option>City</option>
              <option>Country</option>
              <option>Email</option>
            </FormSelect>
          </Col>
          <Col sm="12">
            <label htmlFor="type">NameId Type</label>
            <FormSelect id="type">
              <option>Choose...</option>
              <option>
                urn:oasis:names:tc:SAML:2.0:nameid-format:kerberos
              </option>
              <option>
                urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified
              </option>
              <option>urn:oasis:names:tc:SAML:2.0:nameid-format:entity</option>
              <option>
                urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
              </option>
            </FormSelect>
          </Col>
          <Col md="6" style={{ marginTop: "20px" }}>
            <label htmlFor="enableNamedId">Enable this nameid</label>
          </Col>
          <Col md="6" style={{ marginTop: "20px" }}>
            <FormCheckbox
              id="enableNamedId"
              inline
              checked={enableNamedId}
              onChange={e => setEnableNamedId(!enableNamedId)}
            />
          </Col>
          <Col md="6"></Col>
          <Col md="3">
            <Button id="updateNameIdButton">
              <i className="material-icons">save_alt</i>
              Update
            </Button>
          </Col>
          <Col md="3">
            <Button theme="danger" id="deleteNameIdButton">
              <i className="material-icons">delete</i>
              Delete
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default NamedIdBox;
