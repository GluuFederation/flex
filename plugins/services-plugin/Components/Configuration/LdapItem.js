import React from 'react'
import {
  Col,
  FormGroup,
  Input,
  Card,
  CardBody,
  Badge,
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'

function LdapItem({ ldap, index, formik }) {
  const { t } = useTranslation()
  return (
    <Card
      style={{
        marginBottom: '5px',
        backgroundColor: index % 2 === 0 ? 'white' : '#f7f7f7',
      }}
    >
      <CardBody>
        <FormGroup row>
          <GluuLabel label={t("Configuration Id")} size={4} />
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
          <GluuLabel label={t("Bind DN")} size={4} />
          <Col sm={8}>
            <Input id="bindDN" name="bindDN" defaultValue={ldap.bindDN} onChange={formik.handleChange} />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label={t("Bind Password")} size={4} />
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
          <GluuLabel label={t("Servers")} size={4} />
          <Col sm={8}>
            {ldap.servers && ldap.servers.map((server, index) => (
              <Badge key={index} color="primary">
                {server}
              </Badge>
            ))}
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label={t("Base DNs")} size={4} />
          <Col sm={8}>
            { ldap.baseDNs && ldap.baseDNs.map((dn, index) => (
              <Badge key={index} color="primary">
                {dn}
              </Badge>
            ))}
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label={t("Use SSL")} size={3} />
          <Col sm={1}>
            <Input
              id="useSSL"
              name="useSSL"
              type="checkbox"
              defaultChecked={ldap.useSSL}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label={t("Use Anonymous Bind")} size={3} />
          <Col sm={1}>
            <Input
              id="useAnonymousBind"
              name="useAnonymousBind"
              type="checkbox"
              defaultChecked={ldap.useAnonymousBind}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label={t("Enabled")} size={3} />
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
          <GluuLabel label={t("Max Connections")} size={2} />
          <Col sm={2}>
            <Input
              id="maxConnections"
              name="maxConnections"
              type="number"
              defaultValue={ldap.maxConnections}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label={t("Primary Key")} size={3} />
          <Col sm={1}>
            <Input
              id="primaryKey"
              name="primaryKey"
              type="text"
              defaultValue={ldap.primaryKey}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label={t("Local Primary Key")} size={3} />
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

export default LdapItem
