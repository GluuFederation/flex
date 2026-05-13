import React from 'react'
import classNames from 'classnames'
import type { CustomInputProps } from './types'

const CustomInput: React.FC<CustomInputProps> = ({
  className,
  label,
  name,
  type,
  children,
  onChange,
  onBlur,
  ...otherProps
}) => {
  const inputClass = classNames('form-control', className, {
    'custom-control-empty': !label,
  })

  if (type === 'select') {
    return (
      <select
        data-testid={name}
        className={inputClass}
        name={name}
        onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
        onBlur={onBlur as React.FocusEventHandler<HTMLSelectElement>}
        {...(otherProps as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {children}
      </select>
    )
  }

  return (
    <input
      data-testid={name}
      className={inputClass}
      name={name}
      type={type}
      onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
      onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
      {...(otherProps as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  )
}

export { CustomInput }
