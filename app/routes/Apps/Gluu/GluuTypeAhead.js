import React from 'react'
import { FormGroup } from '../../../components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'

function GluuTypeAhead({ label, name, value, options, formik }) {
  return (
    <FormGroup row>
      <GluuLabel label={label} size={4}/>
      <Typeahead
        emptyLabel=""
        labelKey={name}
        id={name}
        multiple={true}
        defaultSelected={value}
        options={options}
        onChange={formik.handleChange}
      />
    </FormGroup>
  )
}

export default GluuTypeAhead
