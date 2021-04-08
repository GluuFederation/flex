import React from 'react'
import {
  Badge,
  FormGroup,
  Card,
  Col,
  Input,
  CardBody,
  InputGroup,
  CustomInput,
} from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'
function CacheRedis({ config, formik }) {
  return (
    <Card>
      <CardBody>
        <FormGroup row>
        <Col xs="12" style={{fontSize: 24, fontWeight: 'bold', marginBottom: 15}}>redisConfiguration:</Col>
          <GluuLabel label="Redis Provider Type" size={4} />
          <Col sm={8}>
            <InputGroup>
              <CustomInput
                type="select"
                id="redisProviderType"
                name="redisProviderType"
                defaultValue={config.redisProviderType}
                onChange={formik.handleChange}
              >
                <option>STANDALONE</option>
                <option>CLUSTER</option>
                <option>SHARDED</option>
                <option>SENTINEL</option>
              </CustomInput>
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="Servers" size={2} />
          <Col sm={7}>
            <Badge color="primary">{config.servers}</Badge>
          </Col>
          <GluuLabel label="Use SSL" size={2} />
          <Col sm={1}>
            <Input
              type="checkbox"
              name="useSSL"
              id="useSSL"
              defaultChecked={config.useSSL}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="Password" size={2}/>
          <Col sm={3}>
            <Input
              name="password"
              id="password"
              defaultValue={config.password}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="sentinelMasterGroupName" size={4}/>
          <Col sm={3}>
            <Input
              name="sentinelMasterGroupName"
              id="sentinelMasterGroupName"
              defaultValue={config.sentinelMasterGroupName}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="sslTrustStoreFilePath" size={3}/>
          <Col sm={3}>
            <Input
              name="sslTrustStoreFilePath"
              id="sslTrustStoreFilePath"
              defaultValue={config.sslTrustStoreFilePath}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="Default Put Expiration" size={2} />
          <Col sm={2}>
            <Input
              id="redisDefaultPutExpiration"
              name="redisDefaultPutExpiration"
              type="number"
              defaultValue={config.defaultPutExpiration}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="Max Retry Attempts" size={2} />
          <Col sm={2}>
            <Input
              id="maxRetryAttempts"
              name="maxRetryAttempts"
              type="number"
              defaultValue={config.maxRetryAttempts}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="So Timeout" size={2} />
          <Col sm={2}>
            <Input
              id="soTimeout"
              name="soTimeout"
              type="number"
              defaultValue={config.soTimeout}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="Max Idle Connections" size={2} />
          <Col sm={2}>
            <Input
              id="maxIdleConnections"
              name="maxIdleConnections"
              type="number"
              defaultValue={config.maxIdleConnections}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="Max Total Connections" size={2} />
          <Col sm={2}>
            <Input
              id="maxTotalConnections"
              name="maxTotalConnections"
              type="number"
              defaultValue={config.maxTotalConnections}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="Connection Timeout" size={2} />
          <Col sm={2}>
            <Input
              id="connectionTimeout"
              name="connectionTimeout"
              type="number"
              defaultValue={config.connectionTimeout}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
      </CardBody>
    </Card>
  )
}

export default CacheRedis
