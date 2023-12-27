import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from 'reactstrap'

const ExtendedDropdownLink = (props) => {
  const { children, ...otherProps } = props
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen((prevState) => !prevState)

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} {...otherProps}>
      { children }
    </Dropdown>   
  )
}

ExtendedDropdownLink.propTypes = { ...Link.propTypes }
ExtendedDropdownLink.defaultProps = { ...Link.defaultProps }

export { ExtendedDropdownLink }
