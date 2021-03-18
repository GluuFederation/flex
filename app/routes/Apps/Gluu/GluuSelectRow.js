import React from 'react'
import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from '../../../components'
function GluuSelectRow({ label, name, value, formik, values, lsize, rsize }) {
  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} />
      <Col sm={rsize}>
        <InputGroup>
          <CustomInput
            type="select"
            id={name}
            name={name}
            defaultValue={value}
            onChange={formik.handleChange}
          >
            <option value="">Choose...</option>
            {values.map((item, key) => (
              <option key={key}>{item}</option>
            ))}
          </CustomInput>
        </InputGroup>
      </Col>
    </FormGroup>
  )
}

GluuSelectRow.defaultProps = {
  values: [],
  lsize: 3,
  rsize: 9,
}

export default GluuSelectRow
