import React from 'react'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { CACHE } from 'Utils/ApiResources'
import type { CacheMemcachedProps } from './types'
import { CONNECTION_FACTORY_OPTIONS } from '../constants'

function CacheMemcached({ formik, classes, isDark, disabled }: CacheMemcachedProps) {
  return (
    <div className={classes.sectionGrid}>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.servers"
          name="memCacheServers"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.memCacheServers || ''}
          doc_category={CACHE}
          doc_entry="servers"
          isDark={isDark}
          disabled={disabled}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuSelectRow
          label="fields.connection_factory_type"
          name="connectionFactoryType"
          value={formik.values.connectionFactoryType || ''}
          formik={formik}
          values={CONNECTION_FACTORY_OPTIONS}
          lsize={12}
          rsize={12}
          doc_category={CACHE}
          doc_entry="connectionFactoryType"
          isDark={isDark}
          disabled={disabled}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.max_operation_queue_length"
          name="maxOperationQueueLength"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.maxOperationQueueLength}
          doc_category={CACHE}
          doc_entry="maxOperationQueueLength"
          isDark={isDark}
          disabled={disabled}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.buffer_size"
          name="bufferSize"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.bufferSize}
          doc_category={CACHE}
          doc_entry="bufferSize"
          isDark={isDark}
          disabled={disabled}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.default_put_expiration"
          name="memDefaultPutExpiration"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.memDefaultPutExpiration}
          doc_category={CACHE}
          doc_entry="defaultPutExpiration"
          isDark={isDark}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default CacheMemcached
