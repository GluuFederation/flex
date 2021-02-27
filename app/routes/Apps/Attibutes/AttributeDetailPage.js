import React from 'react'
import {
  Container,
  Badge,
  Row,
  Col,
  FormGroup,
  Label,
} from './../../../components'

const AttributeDetailPage = ({ row }) => {
  return (
    <React.Fragment>
      {/* START Content */}
      <Container style={{ backgroundColor: '#F5F5F5' }}>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6}>
                Name:
              </Label>
              <Label for="input" sm={6}>
                {row.name}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6}>
                Display Name:
              </Label>
              <Label for="input" sm={6}>
                {row.displayName}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>Description:</Label>
              <Label sm={6}>{row.description}</Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>Status:</Label>
              <Label sm={6}>{row.status}</Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <FormGroup row>
              <Label sm={6}>Admin Can Access:</Label>
              <Label sm={6}>
                {row.adminCanAccess ? (
                  <Badge color="primary">Yes</Badge>
                ) : (
                  <Badge color="info">No</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup row>
              <Label sm={6}>Admin Can View:</Label>
              <Label sm={6}>
                {row.viewtype ? (
                  <Badge color="primary">Yes</Badge>
                ) : (
                  <Badge color="info">No</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup row>
              <Label sm={6}>Admin Can Edit:</Label>
              <Label sm={6}>
                {row.adminCanEdit ? (
                  <Badge color="primary">Yes</Badge>
                ) : (
                  <Badge color="info">No</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <FormGroup row>
              <Label sm={6}>User Can Access:</Label>
              <Label sm={6}>
                {row.userCanAccess ? (
                  <Badge color="primary">Yes</Badge>
                ) : (
                  <Badge color="info">No</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup row>
              <Label sm={6}>User Can View:</Label>
              <Label sm={6}>
                {row.userCanView ? (
                  <Badge color="primary">Yes</Badge>
                ) : (
                  <Badge color="info">No</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup row>
              <Label sm={6}>User Can Edit:</Label>
              <Label sm={6}>
                {row.userCanEdit ? (
                  <Badge color="primary">Yes</Badge>
                ) : (
                  <Badge color="info">No</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        {/* END Content */}
      </Container>
    </React.Fragment>
  )
}
export default AttributeDetailPage
