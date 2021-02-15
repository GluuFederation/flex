import React from 'react'
import CouchbaseItem from './CouchbaseItem'
import {
  Form,
  FormGroup,
  Container,
  Card,
  CardBody,
} from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
function CouchbasePage(couchbasesData) {
  const couchbases = [
    {
      configId: 'auth_ldap_server',
      servers: ['localhost:1636'],
      connectTimeout: 0,
      computationPoolSize: 0,
      useSSL: true,
    },
  ]
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              {couchbases.map((couchbase, index) => (
                <CouchbaseItem
                  key={index}
                  couchbase={couchbase}
                  index={index}
                ></CouchbaseItem>
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

export default CouchbasePage
