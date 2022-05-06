import React from 'react'
import Toggle from 'react-toggle'
function GluuToogle({ name, formik, value, handler }) {
  return (
    <Toggle
      name={name}
      data-testid={name}
      defaultChecked={value}
      onClick={handler}
      onChange={formik.handleChange}
    />
  )
}

export default GluuToogle
