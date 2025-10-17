import React from 'react'
import { Col } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import { DOC_CATEGORY } from '../helper'
import type { FieldConfig } from './fieldConfigurations'
import type { FormikProps } from 'formik'
import type { ScimFormValues } from '../types'

interface ScimFieldRendererProps {
  config: FieldConfig
  formik: FormikProps<ScimFormValues>
  lsize?: number
  rsize?: number
}

/**
 * Renders a single SCIM form field based on configuration
 */
const ScimFieldRenderer: React.FC<ScimFieldRendererProps> = ({
  config,
  formik,
  lsize = 3,
  rsize = 9,
}) => {
  const { name, label, type, disabled = false, selectOptions } = config

  // Get field value
  const value = formik.values[name]
  const error = formik.errors[name]
  const touched = formik.touched[name]

  switch (type) {
    case 'text':
      return (
        <Col sm={12}>
          <GluuInputRow
            label={label}
            name={name}
            value={(value as string) || ''}
            formik={formik}
            lsize={lsize}
            rsize={rsize}
            disabled={disabled}
            showError={!!(error && touched)}
            errorMessage={error as string}
          />
        </Col>
      )

    case 'number':
      return (
        <Col sm={12}>
          <GluuInputRow
            label={label}
            name={name}
            type="number"
            value={value !== '' && value != null ? value.toString() : ''}
            formik={formik}
            lsize={lsize}
            rsize={rsize}
            showError={!!(error && touched)}
            errorMessage={error as string}
          />
        </Col>
      )

    case 'select':
      return (
        <Col sm={12}>
          <GluuSelectRow
            label={label}
            name={name}
            value={value as string}
            values={selectOptions ? [...selectOptions] : []}
            formik={formik}
            lsize={lsize}
            rsize={rsize}
          />
        </Col>
      )

    case 'toggle':
      return (
        <Col sm={12}>
          <GluuToggleRow
            label={label}
            name={name}
            formik={formik}
            lsize={lsize}
            rsize={rsize}
            doc_category={DOC_CATEGORY}
          />
        </Col>
      )

    default:
      return null
  }
}

export default React.memo(ScimFieldRenderer)
