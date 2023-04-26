import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import {
  Avatar,
  AvatarAddOn,
  DropdownToggle,
  Navbar,
  Nav,
  NavItem,
  Notifications,
  SidebarTrigger,
  ThemeSetting,
  UncontrolledDropdown,
} from 'Components'
import { LanguageMenu } from './LanguageMenu'
import { connect } from 'react-redux'
import { DropdownProfile } from 'Routes/components/Dropdowns/DropdownProfile'
import { randomAvatar } from '../../../utilities'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from './GluuErrorFallBack'

function GluuNavBar({ userinfo }) {
  const userInfo = userinfo ? userinfo : {}
  const [showCollapse, setShowCollapse] = useState(
    window.matchMedia('(max-width: 992px)').matches,
  )
  useEffect(() => {
    window
      .matchMedia('(max-width: 992px)')
      .addEventListener('change', (e) => setShowCollapse(e.matches))
  }, [])
  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <Navbar expand="lg" themed>
        <Nav>
          {showCollapse && (
            <NavItem className="mr-3">
              <SidebarTrigger id="navToggleBtn" />
            </NavItem>
          )}
        </Nav>
        <Box display="flex" justifyContent="space-between" width="100%">
          <h3 className="page-title" id="page-title">Dashboard</h3>
          <Nav className="ml-auto" pills>
            <Notifications />
            <LanguageMenu userInfo={userInfo} />
            <ThemeSetting userInfo={userInfo} />
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav>
                <Avatar.Image
                  size="md"
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
              <DropdownProfile right userinfo={userInfo} />
            </UncontrolledDropdown>
          </Nav>
        </Box>
      </Navbar>
    </ErrorBoundary>
  )
}

GluuNavBar.propTypes = {
  userinfo: PropTypes.object,
}

GluuNavBar.defaultProps = {
  navStyle: {},
}

const mapStateToProps = ({ authReducer }) => {
  const userinfo = authReducer.userinfo
  return {
    userinfo,
  }
}
export default connect(mapStateToProps)(GluuNavBar)
