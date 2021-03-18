import React from 'react'
import { Col, FormGroup, Input } from '../../../components'
import GluuLabel from './GluuLabel'

function GluuCheckBoxRow({ label, name, value, formik, required,lsize, rsize }) {
    return (
      <FormGroup row>
        <GluuLabel label={label} size={lsize} required={required}/>
        <Col sm={rsize}>
          <Input
            id={name}
            type="checkbox"
            name={name}
            defaultChecked={value}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
    )
  }

  GluuCheckBoxRow.defaultProps = {
    type: 'checkbox',
    lsize: 3,
    rsize: 9,
    required: false
  }
export default GluuCheckBoxRow
