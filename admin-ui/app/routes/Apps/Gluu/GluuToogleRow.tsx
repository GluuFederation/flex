import React from 'react'
import type { FormikProps } from 'formik'
import { Col, FormGroup } from 'Components'
import type { CSSProperties } from 'react'
import GluuLabel from './GluuLabel'
import GluuToogle from './GluuToogle'

interface GluuToogleRowProps<T = Record<string, unknown>> {
  label: string
  name: string
  value?: boolean
  formik?: FormikProps<T> | null
  lsize?: number
  handler?: (event: React.ChangeEvent<HTMLInputElement>) => void
  rsize?: number
  doc_category?: string
  doc_entry?: string
  disabled?: boolean
  required?: boolean
  isLabelVisible?: boolean
  labelStyle?: CSSProperties
  isDark?: boolean
}

function GluuToogleRow<T = Record<string, unknown>>({
  label,
  name,
  value,
  formik,
  lsize = 3,
  handler,
  rsize = 9,
  doc_category = 'no_category',
  doc_entry,
  disabled = false,
  required = false,
  isLabelVisible = true,
  labelStyle,
  isDark,
}: GluuToogleRowProps<T>) {
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
        <GluuToogle
          id={name}
          data-testid={name}
          name={name}
          handler={handler}
          formik={formik}
          value={value}
          disabled={disabled}
        />
      </Col>
    </FormGroup>
  )
}
export default GluuToogleRow
