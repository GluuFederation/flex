import React from 'react'
import { Col, FormGroup } from 'Components'
import GluuLabel from './GluuLabel'
import GluuToogle from './GluuToogle'

function GluuToogleRow({
  label,
  name,
  value,
  formik,
  lsize = 3,
  handler,
  rsize = 9,
  doc_category = 'no_category',
  disabled = false,
  required = false,
  isLabelVisible = true,
  labelStyle,
}: any) {
  return (
    <FormGroup row>
      {isLabelVisible && (
        <GluuLabel
          required={required}
          label={label}
          size={lsize}
          doc_category={doc_category}
          doc_entry={name}
          style={labelStyle}
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
