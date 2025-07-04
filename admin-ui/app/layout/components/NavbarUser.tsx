import React from 'react'
import { Link } from 'react-router-dom'

import { NavItem, NavLink } from 'Components'
import type { NavbarUserProps } from './types'

const NavbarUser: React.FC<NavbarUserProps> = (props) => (
  <NavItem {...props}>
    <NavLink tag={Link} to="/pages/login">
      <i className="fa fa-power-off"></i>
    </NavLink>
  </NavItem>
)

export { NavbarUser }
