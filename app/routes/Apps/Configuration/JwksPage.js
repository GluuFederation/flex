import React from 'react'
import {
  Form,
  FormGroup,
  Container,
  Card,
  CardBody,
} from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
import { jwks } from './jwks'
import JwkItem from './JwkItem'
function JwksPage() {
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              {Array.from(jwks['keys']).map((item, index) => (
                <JwkItem key={index} item={item} index={index}></JwkItem>
              ))}
              <FormGroup row></FormGroup>
              <GluuFooter />
            </Form>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default JwksPage
