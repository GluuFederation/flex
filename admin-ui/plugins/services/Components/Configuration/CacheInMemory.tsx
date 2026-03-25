import React from 'react'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { CACHE } from 'Utils/ApiResources'
import type { CacheSubComponentBaseProps } from './types'

function CacheInMemory({ formik, classes, isDark, disabled }: CacheSubComponentBaseProps) {
  return (
    <div className={classes.sectionGrid}>
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.default_put_expiration"
          name="memoryDefaultPutExpiration"
          type="number"
          lsize={12}
          rsize={12}
          formik={formik}
          value={formik.values.memoryDefaultPutExpiration}
          doc_category={CACHE}
          doc_entry="defaultPutExpiration"
          isDark={isDark}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default CacheInMemory
