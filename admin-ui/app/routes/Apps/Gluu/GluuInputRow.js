import React from 'react'
import { Col, FormGroup, Input } from '../../../components'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
function GluuInputRow({
  label,
  name,
  type,
  value,
  formik,
  required,
  lsize,
  rsize,
  doc_category
}) {
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} required={required} />
        <Col sm={rsize}>
          <Input
            id={name}
            data-testid={name}
            type={type}
            name={name}
            defaultValue={value}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

GluuInputRow.defaultProps = {
  type: 'text',
  lsize: 3,
  rsize: 9,
  required: false,
}

export default GluuInputRow
