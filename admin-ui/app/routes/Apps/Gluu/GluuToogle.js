import React, { useEffect, useState } from 'react'
import Toggle from 'react-toggle'
function GluuToogle({ name, formik, value, handler, disabled }) {
  const [checked, setChecked] = useState(value)

  useEffect(() => {
    if(value !== undefined) {
      setChecked(value)
    }
  }, [value])

  return (
    <Toggle
      name={name}
      data-testid={name}
      defaultChecked={value}
      onClick={handler}
      onChange={(event) => {
        setChecked(event.target.checked)
        if(formik !== undefined) {
           formik.handleChange(event)
        } else {
          handler(event)
        }
      }}
      disabled={disabled}
      checked={checked}
    />
  )
}

export default GluuToogle
