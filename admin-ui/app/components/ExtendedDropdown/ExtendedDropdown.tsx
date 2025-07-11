import React from 'react'
import classNames from 'classnames'
import { DropdownMenu, DropdownMenuProps } from 'reactstrap'

interface ExtendedDropdownProps extends DropdownMenuProps {
  className?: string
}

export const ExtendedDropdown: React.FC<ExtendedDropdownProps> = ({ className, ...otherProps }) => {
  const classes = classNames(className, 'extended-dropdown')
  return <DropdownMenu className={classes} {...otherProps} />
}
