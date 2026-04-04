import React from 'react'
import { useTranslation } from 'react-i18next'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { CACHE } from 'Utils/ApiResources'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import type { CacheSubComponentBaseProps } from './types'

const CacheInMemory = ({ formik, classes, isDark, disabled }: CacheSubComponentBaseProps) => {
  const { t } = useTranslation()
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
          placeholder={getFieldPlaceholder(t, 'fields.default_put_expiration')}
        />
      </div>
    </div>
  )
}

export default CacheInMemory
