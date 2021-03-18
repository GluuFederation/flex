import React from 'react'
import { Col, FormGroup, Input } from '../../../components'
import GluuLabel from './GluuLabel'
function GluuInputRow({ label, name, type, value, formik, required,lsize, rsize }) {
  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} required={required}/>
      <Col sm={rsize}>
        <Input
          id={name}
          type={type}
          name={name}
          defaultValue={value}
          onChange={formik.handleChange}
        />
      </Col>
    </FormGroup>
  )
}

GluuInputRow.defaultProps = {
  type: 'text',
  lsize: 3,
  rsize: 9,
  required: false
}

export default GluuInputRow
