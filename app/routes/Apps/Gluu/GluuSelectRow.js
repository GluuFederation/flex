import React from 'react'
import { Col, FormGroup, CustomInput } from '../../../components'
function GluuSelectRow({ label, name, value, formik, values }) {
  return (
    <FormGroup row>
      <GluuLabel label={label} />
      <Col sm={9}>
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

GluuTextAreaRow.defaultProps = {
  values: [],
}

export default GluuTextAreaRow
