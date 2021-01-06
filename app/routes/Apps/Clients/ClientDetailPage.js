import React from "react";
import {
  Container,
  Badge,
  Row,
  Col,
  FormGroup,
  Label
} from "./../../../components";
function ClientDetailPage({ row }) {
  return (
    <React.Fragment>
      {/* START Content */}
      <Container style={{ backgroundColor: "#F5F5F5" }}>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={3}>
                Client ID:
              </Label>
              <Label for="input" sm={9}>
                {row.inum}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6}>
                Client Secret:
              </Label>
              <Label for="input" sm={6}>
                {row.clientSecret ? row.clientSecret : "-"}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6}>
                Name:
              </Label>
              <Label for="input" sm={6}>
                {row.displayName ? row.displayName : "-"}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={3}>
                Description:
              </Label>
              <Label for="input" sm={9}>
                {row.description}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6}>
                Subject Type:
              </Label>
              <Label for="input" sm={6}>
                {row.subjectType ? row.subjectType : "-"}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6}>
                Application Type:
              </Label>
              <Label for="input" sm={6}>
                {row.applicationType}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>Trusted Client:</Label>
              <Label sm={6}>
                {row.trustedClient ? (
                  <Badge color="primary">Yes</Badge>
                ) : (
                  <Badge color="danger">No</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>Status:</Label>
              <Label sm={6}>
                {!row.disabled ? (
                  <Badge color="primary">Enabled</Badge>
                ) : (
                  <Badge color="danger">Disabled</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={4}>Scopes:</Label>
              <Label sm={8}>
                {row.scopes &&
                  row.scopes.map((item, key) => (
                    <Badge key={key} color="primary">
                      {item}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={4}>Grant types:</Label>
              <Label sm={8}>
                {row.grantTypes &&
                  row.grantTypes.map((item, key) => (
                    <Badge key={key} color="primary">
                      {item}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={4}>Response types:</Label>
              <Label sm={8}>
                {row.responseTypes &&
                  row.responseTypes.map((item, key) => (
                    <Badge key={key} color="primary">
                      {item}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={4}>Login uris:</Label>
              <Label sm={8}>
                {row.redirectUris &&
                  row.redirectUris.map((item, key) => (
                    <Badge key={key} color="primary">
                      {item}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        {/* END Content */}
      </Container>
    </React.Fragment>
  );
}

export default ClientDetailPage;
