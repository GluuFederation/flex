import React, { useContext } from 'react'
import {
  Col,
  FormGroup,
  Input,
  Card,
  CardBody,
  Badge,
} from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { ThemeContext } from 'Context/theme/themeContext'

function SqlItem({ ldap, index, formik }) {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  return (
    <Card
      style={{
        marginBottom: '5px',
        backgroundColor: index % 2 === 0 ? 'white' : '#f7f7f7',
      }}
    >
      <CardBody>
        <FormGroup row>
          <GluuLabel label="fields.configuration_id" size={4} />
          <Col sm={8}>
            <Input
              id="configId"
              name="configId"
              defaultValue={ldap.configId}
              disabled
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.bind_dn" size={4} />
          <Col sm={8}>
            <Input
              id="bindDN"
              name="bindDN"
              defaultValue={ldap.bindDN}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.bind_password" size={4} />
          <Col sm={8}>
            <Input
              id="bindPassword"
              name="bindPassword"
              defaultValue={ldap.bindPassword}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.servers" size={4} />
          <Col sm={8}>
            {ldap.servers &&
              ldap.servers.map((server, index) => (
                <Badge key={index} color={`primary-${selectedTheme}`}>
                  {server}
                </Badge>
              ))}
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.base_dns" size={4} />
          <Col sm={8}>
            {ldap.baseDNs &&
              ldap.baseDNs.map((dn, index) => (
                <Badge key={index} color={`primary-${selectedTheme}`}>
                  {dn}
                </Badge>
              ))}
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.use_ssl" size={3} />
          <Col sm={1}>
            <Input
              id="useSSL"
              name="useSSL"
              type="checkbox"
              defaultChecked={ldap.useSSL}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.use_anonymous_bind" size={3} />
          <Col sm={1}>
            <Input
              id="useAnonymousBind"
              name="useAnonymousBind"
              type="checkbox"
              defaultChecked={ldap.useAnonymousBind}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.enabled" size={3} />
          <Col sm={1}>
            <Input
              id="enabled"
              name="enabled"
              type="checkbox"
              defaultChecked={ldap.enabled}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.max_connections" size={2} />
          <Col sm={2}>
            <Input
              id="maxConnections"
              name="maxConnections"
              type="number"
              defaultValue={ldap.maxConnections}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.primary_key" size={3} />
          <Col sm={1}>
            <Input
              id="primaryKey"
              name="primaryKey"
              type="text"
              defaultValue={ldap.primaryKey}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.local_primary_key" size={3} />
          <Col sm={1}>
            <Input
              id="localPrimaryKey"
              name="localPrimaryKey"
              type="text"
              defaultValue={ldap.localPrimaryKey}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
      </CardBody>
    </Card>
  )
}

export default SqlItem
