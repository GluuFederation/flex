// @ts-nocheck
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  AvatarImage,
  AvatarAddOn,
  Navbar,
  NavbarToggler,
  UncontrolledDropdown,
  ThemeConsumer,
} from 'Components'
import { randomAvatar } from './../../../../utilities'

import { NavbarActivityFeed } from './../../../../layout/components/NavbarActivityFeed'
import { NavbarMessages } from './../../../../layout/components/NavbarMessages'
import { NavbarUser } from './../../../../layout/components/NavbarUser'
import { DropdownProfile } from 'Routes/components/Dropdowns/DropdownProfile'
import { NavbarNavigation } from 'Routes/components/Navbars/NavbarNavigation'
import { LogoThemed } from 'Routes/components/LogoThemed/LogoThemed'
import { useTranslation } from 'react-i18next'

export const LayoutNavbar = () => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      <Navbar light expand="lg" themed>
        <Link to="/" className="navbar-brand me-0 me-sm-3">
          <LogoThemed className="mb-1" checkBackground />
        </Link>

        <Nav pills>
          <NavItem>
            <NavLink tag={NavbarToggler} id="navbar-navigation-toggler" className="b-0">
              <i className="fa fa-fw fa-bars"></i>
            </NavLink>
          </NavItem>
        </Nav>

        {/* Navigation with Collapse */}
        <NavbarNavigation pills />

        {/* END Navbar: Left Side */}
        {/* START Navbar: Right Side */}
        <Nav className="ms-auto" pills>
          <NavbarMessages />
          <NavbarActivityFeed />
          {/* START Navbar: Dropdown */}
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav>
              <AvatarImage
                size="sm"
                src={randomAvatar()}
                addOns={[
                  <AvatarAddOn.Icon className="fa fa-circle" color="white" key="avatar-icon-bg" />,
                  <AvatarAddOn.Icon className="fa fa-circle" color="danger" key="avatar-icon-fg" />,
                ]}
              />
            </DropdownToggle>
            <DropdownProfile right />
          </UncontrolledDropdown>
          {/* END Navbar: Dropdown */}
          <NavbarUser className="d-none d-lg-block" />
        </Nav>
        {/* END Navbar: Right Side */}
      </Navbar>

      <Navbar light shadow expand="lg" className="py-3 bg-white">
        <h1 className="mb-0 h4">{t('Navbar Only')}</h1>

        <ThemeConsumer>
          {({ color }) => (
            <Button color={color} className="px-4 my-sm-0">
              {t('Download')} <i className="fa ms-1 fa-fw fa-download"></i>
            </Button>
          )}
        </ThemeConsumer>
      </Navbar>
    </React.Fragment>
  )
}
