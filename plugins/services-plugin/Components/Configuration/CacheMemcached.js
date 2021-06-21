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
import { useTranslation } from 'react-i18next'

function CacheMemcached({ config, formik }) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardBody>
        <FormGroup row>
          <Col
            xs="12"
            style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}
          >
            {t('fields.memcached_configuration')}:
          </Col>
          <GluuLabel label="fields.servers" size={2} />
          <Col sm={6}>
            <Badge color="primary">{config.servers}</Badge>
          </Col>
          <GluuLabel label="fields.connection_factory_type" size={2} />
          <Col sm={2}>
            <CustomInput
              type="select"
              id="connectionFactoryType"
              name="connectionFactoryType"
              defaultValue={config.connectionFactoryType}
              onChange={formik.handleChange}
            >
              <option value="DEFAULT">{t('options.default')}</option>
              <option value="BINARY">{t('options.binary')}</option>
            </CustomInput>
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.max_operation_queue_length" size={2} />
          <Col sm={2}>
            <Input
              id="maxOperationQueueLength"
              name="maxOperationQueueLength"
              type="number"
              defaultValue={config.maxOperationQueueLength}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.buffer_size" size={2} />
          <Col sm={2}>
            <Input
              id="bufferSize"
              name="bufferSize"
              type="number"
              defaultValue={config.bufferSize}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.default_put_expiration" size={2} />
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
