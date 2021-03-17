import React from 'react'
import { Col, FormGroup, Input } from '../../../components'
import GluuLabel from './GluuLabel'
function GluuInputRow({ label, name, type, value, formik }) {
  return (
    <FormGroup row>
      <GluuLabel label={label} />
      <Col sm={9}>
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
}

export default GluuInputRow
