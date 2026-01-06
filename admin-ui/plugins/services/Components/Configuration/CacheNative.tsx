import React, { ReactElement } from 'react'
import { FormGroup, Card, Col, CardBody } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { CACHE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import type { FormikProps } from 'formik'
import type { CacheFormValues } from './types'

interface CacheNativeProps {
  formik: FormikProps<CacheFormValues>
}

function CacheNative({ formik }: CacheNativeProps): ReactElement {
  const { t } = useTranslation()
  return (
    <Card>
      <CardBody>
        <FormGroup row>
          <Col xs="12" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>
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
          value={formik.values.nativeDefaultPutExpiration || 0}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.default_cleanup_batch_size"
          name="defaultCleanupBatchSize"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.defaultCleanupBatchSize || 0}
          doc_category={CACHE}
        />
        <GluuToogleRow
          label="fields.delete_expired_on_get_request"
          name="deleteExpiredOnGetRequest"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.deleteExpiredOnGetRequest}
          doc_category={CACHE}
        />
      </CardBody>
    </Card>
  )
}

export default CacheNative
