import React from 'react'
import { FormGroup,Col } from '../../../components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'

function GluuTypeAhead({ label, name, value, options, formik, required }) {
 // console.log("========name: "+name+ " and value: "+value)
  return (
    <FormGroup row>
      {!!required ? <GluuLabel label={label} size={4} required /> : <GluuLabel label={label} size={4} />}
      <Col sm={8}>
        <Typeahead
          allowNew
          emptyLabel=""
          labelKey={name}
          onChange={(selected) => {
            formik.setFieldValue(name, selected)
          }}
          id={name}
          name={name}
          multiple={true}
          defaultSelected={value}
          options={options}
        />
      </Col>
    </FormGroup>
  )
}

export default GluuTypeAhead
