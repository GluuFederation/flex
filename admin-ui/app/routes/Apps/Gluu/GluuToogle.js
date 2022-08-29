import React from 'react'
import Toggle from 'react-toggle'
function GluuToogle({ name, formik, value, handler, disabled }) {
  return (
    <Toggle
      name={name}
      data-testid={name}
      defaultChecked={value}
      onClick={handler}
      onChange={formik !== undefined ? formik.handleChange : handler}
      disabled={disabled}
    />
  )
}

export default GluuToogle
