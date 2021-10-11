import React from 'react'
import { FormGroup, Card, Col, CardBody } from '../../../../app/components'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from '../../../../app/routes/Apps/Gluu/GluuToogleRow'
import { CACHE } from '../../../../app/utils/ApiResources'
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
        </FormGroup>
        <GluuInputRow
          label="fields.default_put_expiration"
          name="nativeDefaultPutExpiration"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={config.defaultPutExpiration}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.default_cleanup_batch_size"
          name="defaultCleanupBatchSize"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={config.defaultCleanupBatchSize}
          doc_category={CACHE}
        />
        <GluuToogleRow
          label="fields.delete_expired_on_get_request"
          name="deleteExpiredOnGetRequest"
          lsize={6}
          rsize={6}
          formik={formik}
          value={config.deleteExpiredOnGetRequest}
          doc_category={CACHE}
        />
      </CardBody>
    </Card>
  )
}

export default CacheNative
