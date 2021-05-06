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
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
function CacheMemcached({ config, formik }) {
  return (
    <Card>
      <CardBody>
        <FormGroup row>
        <Col xs="12" style={{fontSize: 24, fontWeight: 'bold', marginBottom: 15}}>memcachedConfiguration:</Col>
          <GluuLabel label="Servers" size={2} />
          <Col sm={6}>
            <Badge color="primary">{config.servers}</Badge>
          </Col>
          <GluuLabel label="Connection Factory Type" size={2} />
          <Col sm={2}>
            <CustomInput
                type="select"
                id="connectionFactoryType"
                name="connectionFactoryType"
                defaultValue={config.connectionFactoryType}
                onChange={formik.handleChange}
              >
                <option>DEFAULT</option>
                <option>BINARY</option>
              </CustomInput>
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="Max Operation Queue Length" size={2} />
          <Col sm={2}>
            <Input
              id="maxOperationQueueLength"
              name="maxOperationQueueLength"
              type="number"
              defaultValue={config.maxOperationQueueLength}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="Buffer Size" size={2} />
          <Col sm={2}>
            <Input
              id="bufferSize"
              name="bufferSize"
              type="number"
              defaultValue={config.bufferSize}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="Default Put Expiration" size={2} />
          <Col sm={2}>
            <Input
              type="number"
              name="memDefaultPutExpiration"
              id="memDefaultPutExpiration"
              defaultValue={config.defaultPutExpiration}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
      </CardBody>
    </Card>
  )
}

export default CacheMemcached
