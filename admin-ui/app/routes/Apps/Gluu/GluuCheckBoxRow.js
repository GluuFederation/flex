import React from 'react'
import { Col, FormGroup, Input } from 'Components'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'

function GluuCheckBoxRow({
  label,
  name,
  value,
  required,
  lsize,
  rsize,
  handleOnChange,
  doc_category,
}) {
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} required={required} />
        <Col sm={rsize}>
          <Input
            id={name}
            type="checkbox"
            name={name}
            data-testid={name}
            defaultChecked={value}
            onChange={handleOnChange}
          />
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

GluuCheckBoxRow.defaultProps = {
  type: 'checkbox',
  lsize: 3,
  rsize: 9,
  required: false,
}
export default GluuCheckBoxRow
