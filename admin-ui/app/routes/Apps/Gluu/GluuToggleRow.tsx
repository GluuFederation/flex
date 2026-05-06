import React from 'react'
import { Col, FormGroup } from 'Components'
import type { CSSProperties } from 'react'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToggle from './GluuToggle'
import type { JsonValue } from './types/common'
import type { GluuToggleRowProps } from './types/GluuToggleRow.types'

const GluuToggleRow = <T extends object = Record<string, JsonValue>>({
  label,
  name,
  value,
  formik,
  lsize = 3,
  handler,
  rsize = 9,
  doc_category,
  doc_entry,
  disabled = false,
  required = false,
  isLabelVisible = true,
  labelStyle,
  isDark,
  viewOnly = false,
}: GluuToggleRowProps<T> & {
  labelStyle?: CSSProperties
}) => {
  return (
    <FormGroup row>
      {isLabelVisible && (
        <GluuLabel
          required={required}
          label={label}
          size={lsize}
          doc_category={doc_category}
          doc_entry={doc_entry ?? name}
          style={labelStyle}
          isDark={isDark}
        />
      )}
      <Col sm={rsize}>
        <GluuToggle
          id={name}
          name={name}
          handler={
            handler ??
            (formik
              ? (event: React.ChangeEvent<HTMLInputElement>) => {
                  formik.setFieldValue(name, event.target.checked)
                }
              : undefined)
          }
          formik={formik}
          value={value ?? (formik ? Boolean(formik.values[name as keyof T]) : false)}
          disabled={disabled || viewOnly}
        />
      </Col>
    </FormGroup>
  )
}

export default GluuToggleRow
