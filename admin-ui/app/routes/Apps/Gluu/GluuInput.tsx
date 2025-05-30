// @ts-nocheck
import React from 'react'
import { Col, FormGroup, Input } from 'Components'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
function GluuInput({
  label,
  name,
  type = 'text',
  value,
  required = false,
  lsize = 3,
  rsize = 9,
  doc_category,
}) {
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} required={required} />
        <Col sm={rsize}>
          <Input id={name} data-testid={name} type={type} defaultValue={value} />
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}
export default GluuInput
