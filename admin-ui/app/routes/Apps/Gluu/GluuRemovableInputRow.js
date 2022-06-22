import React from 'react'
import { Col, FormGroup, Input } from 'Components'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
function GluuRemovableInputRow({
  label,
  name,
  type,
  value,
  formik,
  required,
  lsize,
  rsize,
  handler,
  doc_category,
}) {
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} required={required} />
        <Col sm={rsize - 1}>
          <Input
            id={name}
            data-testid={name}
            type={type}
            name={name}
            defaultValue={value}
            onChange={formik.handleChange}
          />
        </Col>
        <div
          style={{
            float: 'right',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: '5px',
            width: '25px',
            height: '25px',
            marginTop: '0px',
            marginRight: '-10px',
          }}
          onClick={handler}
        >
          <i className={'fa fa-fw fa-close'} style={{color:"red"}}></i>
        </div>
      </FormGroup>
    </GluuTooltip>
  )
}

GluuRemovableInputRow.defaultProps = {
  type: 'text',
  lsize: 3,
  rsize: 9,
  required: false,
}

export default GluuRemovableInputRow
