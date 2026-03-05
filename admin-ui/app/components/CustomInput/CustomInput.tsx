import React from 'react'
import classNames from 'classnames'
import { Input as RSCustomInput } from 'reactstrap'

type CustomInputProps = React.ComponentProps<typeof RSCustomInput>

const CustomInput: React.FC<CustomInputProps> = (props) => {
  const { className, label, name, ...otherProps } = props
  const inputClass = classNames(className, {
    'custom-control-empty': !label,
  })

  return (
    <RSCustomInput
      data-testid={name}
      className={inputClass}
      label={label}
      name={name}
      {...otherProps}
    />
  )
}

export { CustomInput }
