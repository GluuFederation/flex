import React from 'react'
import {
  Form,
  FormGroup,
  Container,
  Card,
  CardBody,
} from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
function CachePage() {
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              <FormGroup row></FormGroup>
              <GluuFooter />
            </Form>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default CachePage
