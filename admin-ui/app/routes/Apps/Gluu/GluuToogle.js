import React from 'react'
import Toggle from 'react-toggle'
function GluuToogle({ name, formik, value, handler, disabled }) {
  return (
    <Toggle
      name={name}
      data-testid={name}
      defaultChecked={value}
      onClick={handler}
      onChange={formik.handleChange}
      disabled={disabled}
    />
  )
}

export default GluuToogle
