import React from 'react'
import {
  Form,
  FormGroup,
  Container,
  Card,
  CardBody,
} from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
import LdapItem from './LdapItem'
function LdapPage() {
  const ldaps = [
    {
      configId: 'auth_ldap_server',
      bindDN: 'cn=directory manager',
      bindPassword: 'v7JHsULopbXBz9SEtgx1iQ==',
      servers: ['localhost:1636'],
      maxConnections: 1000,
      useSSL: true,
      baseDNs: ['ou=people,o=jans'],
      primaryKey: 'uid',
      localPrimaryKey: 'uid',
      useAnonymousBind: false,
      enabled: false,
      version: 0,
      level: 0,
    },
  ]
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              {ldaps.map((ldap, index) => (
                <LdapItem key={index} ldap={ldap} index={index}></LdapItem>
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

export default LdapPage
