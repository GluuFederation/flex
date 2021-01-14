import React from "react";
import {
  Container,
  Badge,
  Row,
  Col,
  FormGroup,
  Label
} from "./../../../components";
import GluuFormDetailRow from "../Gluu/GluuFormDetailRow";
function ScopeDetailPage({ row }) {
  function getUmaTypeTheme(status) {
    if (status) {
      return "primary";
    } else {
      return "info";
    }
  }
  return (
    <React.Fragment>
      {/* START Content */}
      <Container style={{ backgroundColor: "#F5F5F5" }}>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow label="Inum" value={row.inum} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="Id" value={row.id} />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow label="Description" value={row.description} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="Scope Type"
              value={row.scopeType}
              isBagde
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>Uma Type:</Label>
              <Label sm={6}>
                <Badge color={getUmaTypeTheme(row.umaType)}>
                  {row.umaType ? "Yes" : "No"}
                </Badge>
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>Default Scope:</Label>
              <Label sm={6}>
                <Badge color={getUmaTypeTheme(row.defaultScope)}>
                  {row.defaultScope ? "Yes" : "No"}
                </Badge>
              </Label>
            </FormGroup>
          </Col>
        </Row>
        {/* END Content */}
      </Container>
    </React.Fragment>
  );
}

export default ScopeDetailPage;
