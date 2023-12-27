import React from 'react'
import classNames from 'classnames'
import { Input as RSCustomInput } from 'reactstrap'

const CustomInput = (props) => {
  const { className, ...otherProps } = props
  const inputClass = classNames(className, {
    'custom-control-empty': !props.label,
  })

  return (
    <RSCustomInput
      data-testid={props.name}
      className={inputClass}
      {...otherProps}
    />
  )
}
CustomInput.propTypes = { ...RSCustomInput.propTypes }

export { CustomInput }
