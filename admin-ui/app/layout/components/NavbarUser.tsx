import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { NavItem, NavLink } from 'Components'

interface NavbarUserProps {
  className?: string
  style?: React.CSSProperties
}

const NavbarUser: React.FC<NavbarUserProps> = (props) => (
  <NavItem {...props}>
    <NavLink tag={Link} to="/pages/login">
      <i className="fa fa-power-off"></i>
    </NavLink>
  </NavItem>
)

NavbarUser.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
}

export { NavbarUser }
