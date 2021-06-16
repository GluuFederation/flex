import React from 'react'
import {
  Form,
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
        <Col xs="12" style={{fontSize: 24, fontWeight: 'bold', marginBottom: 15}}>nativePersistenceConfiguration:</Col>
          <GluuLabel label={t("Default Put Expiration")} size={2} />
          <Col sm={2}>
            <Input
              id="nativeDefaultPutExpiration"
              name="nativeDefaultPutExpiration"
              type="number"
              defaultValue={config.defaultPutExpiration}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label={t("Default Cleanup Batch Size")} size={2} />
          <Col sm={2}>
            <Input
              id="defaultCleanupBatchSize"
              name="defaultCleanupBatchSize"
              type="number"
              defaultValue={config.defaultCleanupBatchSize}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label={t("Delete Expired OnGetRequest")} size={2} />
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
