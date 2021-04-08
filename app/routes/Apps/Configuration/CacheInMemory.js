import React from 'react'
import {
  Form,
  FormGroup,
  Card,
  Col,
  Input,
  CardBody,
} from './../../../components'
import GluuLabel from '../Gluu/GluuLabel'
function CacheInMemory({ config }) {
  return (
    <Card>
      <CardBody>
        <FormGroup row>
        <Col xs="12" style={{fontSize: 24, fontWeight: 'bold', marginBottom: 15}}>inMemoryConfiguration:</Col>
          <GluuLabel label="Default Put Expiration" size={6} />
          <Col sm={6}>
            <Input
              id="defaultPutExpiration"
              name="defaultPutExpiration"
              type="number"
              defaultValue={config.defaultPutExpiration}
            />
          </Col>
        </FormGroup>
      </CardBody>
    </Card>
  )
}

export default CacheInMemory
