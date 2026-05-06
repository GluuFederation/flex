import React, { useEffect, useState } from 'react'
import type { FormikProps } from 'formik'
import Toggle from 'react-toggle'
import type { JsonValue } from './types/common'

type GluuToggleProps<T = Record<string, JsonValue>> = {
  id?: string
  name: string
  formik?: FormikProps<T> | null
  value?: boolean
  handler?: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const GluuToggle = <T = Record<string, JsonValue>,>({
  id,
  name,
  formik,
  value,
  handler,
  disabled,
}: GluuToggleProps<T>) => {
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
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked)
        if (formik) {
          formik.handleChange(event)
          if (handler) {
            handler(event)
          }
        } else {
          handler?.(event)
        }
      }}
      disabled={disabled}
      checked={checked}
    />
  )
}

export default GluuToggle
