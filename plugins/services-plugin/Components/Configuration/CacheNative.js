import React from 'react'
import {
  FormGroup,
  Card,
  Col,
  Input,
  CardBody,
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'

function CacheNative({ config, formik }) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardBody>
        <FormGroup row>
          <Col
            xs="12"
            style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}
          >
            {t('fields.native_persistence_configuration')}:
          </Col>
          <GluuLabel label="fields.default_put_expiration" size={2} />
          <Col sm={2}>
            <Input
              id="nativeDefaultPutExpiration"
              name="nativeDefaultPutExpiration"
              type="number"
              defaultValue={config.defaultPutExpiration}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.default_cleanup_batch_size" size={2} />
          <Col sm={2}>
            <Input
              id="defaultCleanupBatchSize"
              name="defaultCleanupBatchSize"
              type="number"
              defaultValue={config.defaultCleanupBatchSize}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.delete_expired_on_get_request" size={2} />
          <Col sm={1}>
            <Input
              type="checkbox"
              name="deleteExpiredOnGetRequest"
              id="deleteExpiredOnGetRequest"
              defaultChecked={config.deleteExpiredOnGetRequest}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
      </CardBody>
    </Card>
  )
}

export default CacheNative
