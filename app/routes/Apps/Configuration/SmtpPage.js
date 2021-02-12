import React from 'react'
import {
  Col,
  Form,
  FormGroup,
  Container,
  Input,
  Card,
  CardBody,
} from './../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuFooter from '../Gluu/GluuFooter'
function SmtpPage({ smtp }) {
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              <FormGroup row>
                <GluuLabel label="Name" required />
                <Col sm={9}>
                  <Input
                    placeholder="Enter the attribute name"
                    id="name"
                    name="name"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Name" required />
                <Col sm={9}>
                  <Input
                    placeholder="Enter the attribute name"
                    id="name"
                    name="name"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Name" required />
                <Col sm={9}>
                  <Input
                    placeholder="Enter the attribute name"
                    id="name"
                    name="name"
                  />
                </Col>
              </FormGroup>
              <FormGroup row></FormGroup>
              <GluuFooter />
            </Form>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default SmtpPage
