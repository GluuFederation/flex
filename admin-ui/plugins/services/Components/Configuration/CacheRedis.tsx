import React, { useContext, ReactElement } from 'react'
import { Badge, FormGroup, Card, Col, CardBody, InputGroup, CustomInput } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { CACHE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import type { CacheRedisProps } from './types'

function CacheRedis({ config, formik }: CacheRedisProps): ReactElement {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'

  return (
    <Card>
      <CardBody>
        <FormGroup row>
          <Col sm="12" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>
            {t('fields.redis_configuration')}:
          </Col>
        </FormGroup>
        <GluuTooltip doc_category={CACHE} doc_entry="redisProviderType">
          <FormGroup row>
            <GluuLabel label="fields.redis_provider_type" size={6} />
            <Col sm={6}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="redisProviderType"
                  name="redisProviderType"
                  defaultValue={config.redisProviderType}
                  onChange={formik.handleChange}
                >
                  <option value="STANDALONE">{t('options.standalone')}</option>
                  <option value="CLUSTER">{t('options.cluster')}</option>
                  <option value="SHARDED">{t('options.sharded')}</option>
                  <option value="SENTINEL">{t('options.sentinel')}</option>
                </CustomInput>
              </InputGroup>
            </Col>
          </FormGroup>
        </GluuTooltip>
        <GluuTooltip doc_category={CACHE} doc_entry="servers">
          <FormGroup row>
            <GluuLabel label="fields.servers" size={6} />
            <Col sm={6}>
              <Badge color={`primary-${selectedTheme}`}>{config.servers}</Badge>
            </Col>
          </FormGroup>
        </GluuTooltip>
        <GluuToogleRow
          name="useSSL"
          formik={formik}
          lsize={6}
          rsize={6}
          label="fields.use_ssl"
          value={config.useSSL}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.password"
          name="password"
          type="password"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.password}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.sentinel_master_group_name"
          name="sentinelMasterGroupName"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.sentinelMasterGroupName}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.ssl_trust_store_file_path"
          name="sslTrustStoreFilePath"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.sslTrustStoreFilePath}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.default_put_expiration"
          name="redisDefaultPutExpiration"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.redisDefaultPutExpiration}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.max_retry_attempts"
          name="maxRetryAttempts"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.maxRetryAttempts}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.so_timeout"
          name="soTimeout"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.soTimeout}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.max_idle_connections"
          name="maxIdleConnections"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.maxIdleConnections}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.max_total_connections"
          name="maxTotalConnections"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.maxTotalConnections}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.connection_timeout"
          name="connectionTimeout"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={formik.values.connectionTimeout}
          doc_category={CACHE}
        />
      </CardBody>
    </Card>
  )
}

export default CacheRedis
