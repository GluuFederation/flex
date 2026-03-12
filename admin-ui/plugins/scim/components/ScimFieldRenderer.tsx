import React, { useMemo } from 'react'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import { DOC_CATEGORY } from '../helper'
import type { FieldConfig } from './constants'
import type { FormikProps } from 'formik'
import type { ScimFormValues } from '../types'

interface ScimFieldRendererProps {
  config: FieldConfig
  formik: FormikProps<ScimFormValues>
  fieldItemClass: string
  fieldItemFullWidthClass: string
}

const LABEL_SIZE = 12
const INPUT_SIZE = 12
const EMPTY_OPTIONS: string[] = []

const ScimFieldRenderer: React.FC<ScimFieldRendererProps> = ({
  config,
  formik,
  fieldItemClass,
  fieldItemFullWidthClass,
}) => {
  const { name, label, type, disabled = false, selectOptions, colSize = 12 } = config

  const value = formik.values[name]
  const error = formik.errors[name]
  const touched = formik.touched[name]

  const itemClass = colSize === 12 ? fieldItemFullWidthClass : fieldItemClass

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
            disabled={disabled}
            showError={!!(error && touched)}
            errorMessage={error as string}
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
            showError={!!(error && touched)}
            errorMessage={error as string}
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
            doc_category={DOC_CATEGORY}
          />
        </div>
      )

    default:
      return null
  }
}

export default React.memo(ScimFieldRenderer)
