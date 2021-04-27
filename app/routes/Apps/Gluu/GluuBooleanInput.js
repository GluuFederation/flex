import React from 'react'
import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from '../../../components'

function GluuBooleanInput({
  label,
  name,
  value,
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
          >
            <option value="false">false</option>
            <option value="true">true</option>
          </CustomInput>
        </InputGroup>
      </Col>
    </FormGroup>
  )
}

export default GluuBooleanInput
