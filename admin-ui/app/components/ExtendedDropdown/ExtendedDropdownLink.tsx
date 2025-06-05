import React, { useState, ReactNode } from 'react'
import { LinkProps } from 'react-router-dom'
import { Dropdown, DropdownProps } from 'reactstrap'

interface ExtendedDropdownLinkProps extends LinkProps, Omit<DropdownProps, 'toggle'> {
  children: ReactNode
}

const ExtendedDropdownLink: React.FC<ExtendedDropdownLinkProps> = (props) => {
  const { children, ...otherProps } = props
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen((prevState) => !prevState)

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} {...otherProps}>
      {children}
    </Dropdown>   
  )
}
export { ExtendedDropdownLink }
