import React, { ReactElement } from 'react'
import { FormGroup, Card, Col, CardBody } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { CACHE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import type { CacheInMemoryProps } from './types'

function CacheInMemory({ formik }: CacheInMemoryProps): ReactElement {
  const { t } = useTranslation()
  return (
    <Card>
      <CardBody>
        <FormGroup row>
          <Col xs="12" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>
            {t('fields.in_memory_configuration')}:
          </Col>
        </FormGroup>
        <GluuInputRow
          label="fields.default_put_expiration"
          name="memoryDefaultPutExpiration"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.memoryDefaultPutExpiration}
          doc_category={CACHE}
        />
      </CardBody>
    </Card>
  )
}

export default CacheInMemory
