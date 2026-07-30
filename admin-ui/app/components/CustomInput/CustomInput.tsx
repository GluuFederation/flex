import React from 'react'
import clsx from 'clsx'
import type { CustomInputProps } from './types'

const CustomInput: React.FC<CustomInputProps> = ({
  className,
  label,
  name,
  type,
  children,
  onChange,
  onBlur,
  invalid,
  error,
  ...otherProps
}) => {
  const inputClass = clsx('form-control', className, {
    'custom-control-empty': !label,
    'is-invalid': invalid,
  })

  // Only associate the control with feedback that is actually rendered, and
  // only when `name` can supply a stable id.
  const errorId = error && name ? `${name}-error` : undefined

  const control =
    type === 'select' ? (
      <select
        data-testid={name}
        className={inputClass}
        name={name}
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
        onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
        onBlur={onBlur as React.FocusEventHandler<HTMLSelectElement>}
        {...(otherProps as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {children}
      </select>
    ) : (
      <input
        data-testid={name}
        className={inputClass}
        name={name}
        type={type}
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
        {...(otherProps as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    )

  if (!error) {
    return control
  }

  return (
    <>
      {control}
      <div
        id={errorId}
        className="invalid-feedback d-block"
        data-testid={name ? `${name}-error` : undefined}
      >
        {error}
      </div>
    </>
  )
}

export { CustomInput }
