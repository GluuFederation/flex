import React from 'react'
import { FormGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { CACHE } from 'Utils/ApiResources'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import type { CacheRedisProps } from './types'
import { REDIS_PROVIDER_OPTIONS } from '../helper'

const CacheRedis = ({ formik, classes, isDark, disabled }: CacheRedisProps) => {
  const { t } = useTranslation()
  return (
    <div className={classes.sectionGrid}>
      <div className={classes.fieldItem}>
        <GluuSelectRow
          label="fields.redis_provider_type"
          name="redisProviderType"
          value={formik.values.redisProviderType || ''}
          formik={formik}
          values={REDIS_PROVIDER_OPTIONS}
          lsize={12}
          rsize={12}
          doc_category={CACHE}
          doc_entry="redisProviderType"
          isDark={isDark}
          disabled={disabled}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.servers"
          name="servers"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.servers || ''}
          doc_category={CACHE}
          doc_entry="servers"
          isDark={isDark}
          disabled={disabled}
          placeholder={getFieldPlaceholder(t, 'fields.servers')}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.password"
          name="password"
          type="password"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.password}
          doc_category={CACHE}
          doc_entry="password"
          isDark={isDark}
          disabled={disabled}
          placeholder={getFieldPlaceholder(t, 'fields.password')}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.sentinel_master_group_name"
          name="sentinelMasterGroupName"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.sentinelMasterGroupName}
          doc_category={CACHE}
          doc_entry="sentinelMasterGroupName"
          isDark={isDark}
          disabled={disabled}
          placeholder={getFieldPlaceholder(t, 'fields.sentinel_master_group_name')}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.ssl_trust_store_file_path"
          name="sslTrustStoreFilePath"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.sslTrustStoreFilePath}
          doc_category={CACHE}
          doc_entry="sslTrustStoreFilePath"
          isDark={isDark}
          disabled={disabled}
          placeholder={getFieldPlaceholder(t, 'fields.ssl_trust_store_file_path')}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.default_put_expiration"
          name="redisDefaultPutExpiration"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.redisDefaultPutExpiration}
          doc_category={CACHE}
          doc_entry="defaultPutExpiration"
          isDark={isDark}
          disabled={disabled}
          placeholder={getFieldPlaceholder(t, 'fields.default_put_expiration')}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.max_retry_attempts"
          name="maxRetryAttempts"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.maxRetryAttempts}
          doc_category={CACHE}
          doc_entry="maxRetryAttempts"
          isDark={isDark}
          disabled={disabled}
          placeholder={getFieldPlaceholder(t, 'fields.max_retry_attempts')}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.so_timeout"
          name="soTimeout"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.soTimeout}
          doc_category={CACHE}
          doc_entry="soTimeout"
          isDark={isDark}
          disabled={disabled}
          placeholder={getFieldPlaceholder(t, 'fields.so_timeout')}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.max_idle_connections"
          name="maxIdleConnections"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.maxIdleConnections}
          doc_category={CACHE}
          doc_entry="maxIdleConnections"
          isDark={isDark}
          disabled={disabled}
          placeholder={getFieldPlaceholder(t, 'fields.max_idle_connections')}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.max_total_connections"
          name="maxTotalConnections"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.maxTotalConnections}
          doc_category={CACHE}
          doc_entry="maxTotalConnections"
          isDark={isDark}
          disabled={disabled}
          placeholder={getFieldPlaceholder(t, 'fields.max_total_connections')}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.connection_timeout"
          name="connectionTimeout"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.connectionTimeout}
          doc_category={CACHE}
          doc_entry="connectionTimeout"
          isDark={isDark}
          disabled={disabled}
          placeholder={getFieldPlaceholder(t, 'fields.connection_timeout')}
        />
      </div>
      <div className={classes.fieldItem}>
        <FormGroup>
          <GluuLabel
            label="fields.use_ssl"
            size={12}
            isDark={isDark}
            doc_category={CACHE}
            doc_entry="useSSL"
          />
          <GluuToogleRow
            isLabelVisible={false}
            label="fields.use_ssl"
            name="useSSL"
            lsize={12}
            rsize={12}
            formik={formik}
            value={formik.values.useSSL}
            doc_category={CACHE}
            doc_entry="useSSL"
            isDark={isDark}
            disabled={disabled}
          />
        </FormGroup>
      </div>
    </div>
  )
}

export default CacheRedis
