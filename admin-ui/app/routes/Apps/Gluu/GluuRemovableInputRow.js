import React from 'react'
import { Col, FormGroup, Input } from 'Components'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
import applicationStyle from './styles/applicationstyle'

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
  isDirect,
}) {
  return (
    <GluuTooltip
      doc_category={doc_category}
      isDirect={isDirect}
      doc_entry={name}
    >
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
          style={applicationStyle.removableInputRow}
          onClick={handler}
        >
          <i className={'fa fa-fw fa-close'} style={{ color: 'red' }}></i>
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
