import React from 'react'
import PropTypes from 'prop-types'
import {
  Avatar,
  AvatarAddOn,
  DropdownToggle,
  NavbarThemeProvider,
  Navbar,
  Nav,
  NavItem,
  SidebarTrigger,
  UncontrolledDropdown,
} from '../../../components'
import { NavbarActivityFeed } from '../../../layout/components/NavbarActivityFeed'
import { NavbarMessages } from '../../../layout/components/NavbarMessages'
import { LanguageMenu } from './LanguageMenu'
import { connect } from 'react-redux'
import { DropdownProfile } from '../../../routes/components/Dropdowns/DropdownProfile'
import { randomAvatar } from '../../../utilities'
function GluuNavBar({ themeColor, themeStyle, userinfo }) {
  return (
    <NavbarThemeProvider
      style={themeStyle}
      color={themeColor}
      className="shadow-sm"
    >
      <Navbar expand="lg" themed>
        <Nav>
          <NavItem className="mr-3">
            <SidebarTrigger id="navToggleBtn" />
          </NavItem>
        </Nav>
        <Nav className="ml-auto" pills>
          <NavbarMessages  />
          <NavbarActivityFeed />
          <LanguageMenu />
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav>
              <Avatar.Image
                size="sm"
                src={randomAvatar()}
                addOns={[
                  <AvatarAddOn.Icon
                    className="fa fa-circle"
                    color="white"
                    key="avatar-icon-bg"
                  />,
                  <AvatarAddOn.Icon
                    className="fa fa-circle"
                    color="success"
                    key="avatar-icon-fg"
                  />,
                ]}
              />
            </DropdownToggle>
            <DropdownProfile right userinfo={userinfo} />
          </UncontrolledDropdown>
        </Nav>
      </Navbar>
    </NavbarThemeProvider>
  )
}

GluuNavBar.propTypes = {
  navStyle: PropTypes.oneOf(['pills', 'accent', 'default']),
  themeStyle: PropTypes.string,
  themeColor: PropTypes.string,
}
GluuNavBar.defaultProps = {
  navStyle: 'default',
  themeStyle: 'dark',
  themeColor: 'primary',
}

const mapStateToProps = ({ authReducer }) => {
  const userinfo = authReducer.userinfo
  return {
    userinfo,
  }
}
export default connect(mapStateToProps)(GluuNavBar)
