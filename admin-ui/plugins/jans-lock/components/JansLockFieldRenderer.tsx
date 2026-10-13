import React, { useMemo } from 'react'
import { getIn } from 'formik'
import { useTranslation } from 'react-i18next'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import { jansLockConstants } from '../helper'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { JansLockFieldRendererProps } from '../types'

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
  const {
    name,
    label,
    type,
    readOnly = false,
    required = false,
    selectOptions,
    colSize = 12,
    placeholder,
  } = config

  const value: JsonValue | undefined = getIn(formik.values, name)
  const error: JsonValue | undefined = getIn(formik.errors, name)
  const errorMessage = typeof error === 'string' ? error : ''

  const itemClass = colSize === 12 ? fieldItemFullWidthClass : fieldItemClass
  const isDisabled = readOnly || viewOnly
  const resolvedPlaceholder = placeholder ? t(placeholder) : undefined

  const stableOptions = useMemo(
    () => (selectOptions ? [...selectOptions] : EMPTY_OPTIONS),
    [selectOptions],
  )

  switch (type) {
    case 'text':
    case 'password':
    case 'number':
      return (
        <div className={itemClass}>
          <GluuInputRow
            label={label}
            name={name}
            type={type}
            value={value == null ? '' : String(value)}
            formik={formik}
            lsize={LABEL_SIZE}
            rsize={INPUT_SIZE}
            required={required}
            disabled={isDisabled}
            allowPasswordToggleWhenDisabled={type === 'password'}
            showError={!!errorMessage}
            errorMessage={errorMessage}
            placeholder={resolvedPlaceholder}
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
            value={value == null ? '' : String(value)}
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
            value={Boolean(value)}
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
