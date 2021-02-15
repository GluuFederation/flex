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
function CacheNative({ config }) {
  return (
    <Card>
      <CardBody>
        <FormGroup row>
          <GluuLabel label="Default Put Expiration" size={2} />
          <Col sm={2}>
            <Input
              id="defaultPutExpiration"
              name="defaultPutExpiration"
              type="number"
              defaultValue={config.defaultPutExpiration}
            />
          </Col>
          <GluuLabel label="Default Cleanup Batch Size" size={2} />
          <Col sm={2}>
            <Input
              id="defaultCleanupBatchSize"
              name="defaultCleanupBatchSize"
              type="number"
              defaultValue={config.defaultCleanupBatchSize}
            />
          </Col>
          <GluuLabel label="Delete Expired OnGetRequest" size={2} />
          <Col sm={1}>
            <Input
              type="checkbox"
              name="deleteExpiredOnGetRequest"
              id="deleteExpiredOnGetRequest"
              defaultChecked={config.deleteExpiredOnGetRequest}
            />
          </Col>
        </FormGroup>
      </CardBody>
    </Card>
  )
}

export default CacheNative
