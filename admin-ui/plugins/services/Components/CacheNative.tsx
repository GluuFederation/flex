import React from 'react'
import { FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { CACHE } from 'Utils/ApiResources'
import type { CacheSubComponentBaseProps } from './types'

const CacheNative = ({ formik, classes, isDark, disabled }: CacheSubComponentBaseProps) => {
  return (
    <div className={classes.sectionGrid}>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.default_put_expiration"
          name="nativeDefaultPutExpiration"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.nativeDefaultPutExpiration}
          doc_category={CACHE}
          doc_entry="defaultPutExpiration"
          isDark={isDark}
          disabled={disabled}
        />
      </div>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.default_cleanup_batch_size"
          name="defaultCleanupBatchSize"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.defaultCleanupBatchSize}
          doc_category={CACHE}
          doc_entry="defaultCleanupBatchSize"
          isDark={isDark}
          disabled={disabled}
        />
      </div>
      <div className={classes.fieldItem}>
        <FormGroup>
          <GluuLabel
            label="fields.delete_expired_on_get_request"
            size={12}
            isDark={isDark}
            doc_category={CACHE}
            doc_entry="deleteExpiredOnGetRequest"
          />
          <GluuToogleRow
            isLabelVisible={false}
            label="fields.delete_expired_on_get_request"
            name="deleteExpiredOnGetRequest"
            lsize={12}
            rsize={12}
            formik={formik}
            value={formik.values.deleteExpiredOnGetRequest}
            doc_category={CACHE}
            doc_entry="deleteExpiredOnGetRequest"
            isDark={isDark}
            disabled={disabled}
          />
        </FormGroup>
      </div>
    </div>
  )
}

export default CacheNative
