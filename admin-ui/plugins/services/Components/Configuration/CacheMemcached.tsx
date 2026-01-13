import React, { useContext, ReactElement } from 'react'
import { Badge, FormGroup, Card, Col, CardBody, CustomInput } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { CACHE } from 'Utils/ApiResources'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import type { CacheMemcachedProps } from './types'

function CacheMemcached({ config, formik }: CacheMemcachedProps): ReactElement {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'

  return (
    <Card>
      <CardBody>
        <GluuTooltip doc_category={CACHE} doc_entry="servers">
          <FormGroup row>
            <GluuLabel label="fields.servers" size={6} />
            <Col sm={6}>
              <Badge color={`primary-${selectedTheme}`}>{config.servers}</Badge>
            </Col>
          </FormGroup>
        </GluuTooltip>
        <GluuTooltip doc_category={CACHE} doc_entry="connectionFactoryType">
          <FormGroup row>
            <GluuLabel label="fields.connection_factory_type" size={6} />
            <Col sm={6}>
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
        </GluuTooltip>
        <GluuInputRow
          label="fields.max_operation_queue_length"
          name="maxOperationQueueLength"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.maxOperationQueueLength}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.buffer_size"
          name="bufferSize"
          type="number"
          formik={formik}
          lsize={6}
          rsize={6}
          value={formik.values.bufferSize}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.default_put_expiration"
          name="memDefaultPutExpiration"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.memDefaultPutExpiration}
          doc_category={CACHE}
        />
      </CardBody>
    </Card>
  )
}

export default CacheMemcached
