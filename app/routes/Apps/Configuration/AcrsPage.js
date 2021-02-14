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

function AcrsPage(acrData) {
  const arc = { defaultAcr: 'simple_password_auth' }
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              <FormGroup row>
                <GluuLabel label="Default Acr" required />
                <Col sm={9}>
                  <Input
                    placeholder="Enter the name of the script that will be use by default."
                    id="defaultAcr"
                    name="defaultAcr"
                    defaultValue={arc.defaultAcr}
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

export default AcrsPage
