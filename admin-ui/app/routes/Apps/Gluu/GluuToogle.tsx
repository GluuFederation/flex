import { useEffect, useState } from 'react'
import Toggle from 'react-toggle'
function GluuToogle({ id, name, formik, value, handler, disabled }: any) {
  const [checked, setChecked] = useState(value || false)

  useEffect(() => {
    if (value !== undefined) {
      setChecked(value)
    }
  }, [value])

  return (
    <Toggle
      id={id}
      name={name}
      data-testid={name}
      onChange={(event: any) => {
        setChecked(event.target.checked)
        if (formik !== undefined) {
          formik.handleChange(event)
          if (handler) {
            handler(event)
          }
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
