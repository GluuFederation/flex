import React from 'react'
import { Col, FormGroup, Input } from 'Components'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'

function GluuInumInput({ label, name, value, lsize, rsize, doc_category }) {
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} />
        <Col sm={rsize}>
          <Input
            style={{ backgroundColor: '#F5F5F5' }}
            id={name}
            data-testid={name}
            name={name}
            disabled
            value={value}
          />
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}
GluuInumInput.defaultProps = {
  lsize: 4,
  rsize: 8,
}

export default GluuInumInput
