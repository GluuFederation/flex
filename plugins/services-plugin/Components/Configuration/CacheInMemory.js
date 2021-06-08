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

function CacheInMemory({ config, formik }) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardBody>
        <FormGroup row>
        <Col xs="12" style={{fontSize: 24, fontWeight: 'bold', marginBottom: 15}}>inMemoryConfiguration:</Col>
          <GluuLabel label={t("Default Put Expiration")} size={6} />
          <Col sm={6}>
            <Input
              id="memoryDefaultPutExpiration"
              name="memoryDefaultPutExpiration"
              type="number"
              defaultValue={config.defaultPutExpiration}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
      </CardBody>
    </Card>
  )
}

export default CacheInMemory
