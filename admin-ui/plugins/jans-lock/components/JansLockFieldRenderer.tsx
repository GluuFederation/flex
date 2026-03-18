import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import { jansLockConstants } from '../helper/constants'
import type { FormikProps } from 'formik'
import type { FieldConfig, JansLockConfigFormValues } from '../types'

type JansLockFieldRendererProps = {
  config: FieldConfig
  formik: FormikProps<JansLockConfigFormValues>
  fieldItemClass: string
  fieldItemFullWidthClass: string
  viewOnly: boolean
}

const LABEL_SIZE = 12
const INPUT_SIZE = 12
const EMPTY_OPTIONS: string[] = []
const DOC_CATEGORY = jansLockConstants.DOC_CATEGORY

const JansLockFieldRenderer: React.FC<JansLockFieldRendererProps> = ({
  config,
  formik,
  fieldItemClass,
  fieldItemFullWidthClass,
  viewOnly,
}) => {
  const { t } = useTranslation()
  const { name, label, type, disabled = false, selectOptions, colSize = 12, placeholder } = config

  const value = formik.values[name]
  const error = formik.errors[name]
  const touched = formik.touched[name]

  const itemClass = colSize === 12 ? fieldItemFullWidthClass : fieldItemClass
  const isDisabled = disabled || viewOnly

  const stableOptions = useMemo(
    () => (selectOptions ? [...selectOptions] : EMPTY_OPTIONS),
    [selectOptions],
  )

  switch (type) {
    case 'text':
      return (
        <div className={itemClass}>
          <GluuInputRow
            label={label}
            name={name}
            value={(value as string) || ''}
            formik={formik}
            lsize={LABEL_SIZE}
            rsize={INPUT_SIZE}
            disabled={isDisabled}
            showError={!!(error && touched)}
            errorMessage={error as string}
            placeholder={placeholder ? t(placeholder) : undefined}
            doc_category={DOC_CATEGORY}
          />
        </div>
      )

    case 'number':
      return (
        <div className={itemClass}>
          <GluuInputRow
            label={label}
            name={name}
            type="number"
            value={value !== '' && value != null ? value.toString() : ''}
            formik={formik}
            lsize={LABEL_SIZE}
            rsize={INPUT_SIZE}
            disabled={isDisabled}
            showError={!!(error && touched)}
            errorMessage={error as string}
            placeholder={placeholder ? t(placeholder) : undefined}
            doc_category={DOC_CATEGORY}
          />
        </div>
      )

    case 'select':
      return (
        <div className={itemClass}>
          <GluuSelectRow
            label={label}
            name={name}
            value={value as string}
            values={stableOptions}
            formik={formik}
            lsize={LABEL_SIZE}
            rsize={INPUT_SIZE}
            disabled={isDisabled}
            doc_category={DOC_CATEGORY}
          />
        </div>
      )

    case 'toggle':
      return (
        <div className={itemClass}>
          <GluuToggleRow
            label={label}
            name={name}
            formik={formik}
            lsize={LABEL_SIZE}
            rsize={INPUT_SIZE}
            viewOnly={isDisabled}
            doc_category={DOC_CATEGORY}
          />
        </div>
      )

    default:
      return null
  }
}

export default React.memo(JansLockFieldRenderer)
