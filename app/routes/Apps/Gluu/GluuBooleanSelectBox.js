import React from 'react'
import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from '../../../components'

function GluuBooleanSelectBox({
  label,
  name,
  value,
  formik,
  lsize,
  rsize,
}) {
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
            <option value="false">false</option>
            <option value="true">true</option>
          </CustomInput>
        </InputGroup>
      </Col>
    </FormGroup>
  )
}

export default GluuBooleanSelectBox
