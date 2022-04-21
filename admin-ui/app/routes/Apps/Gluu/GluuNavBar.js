import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
} from '../../../components';
import { LanguageMenu } from './LanguageMenu';
import { connect } from 'react-redux';
import { DropdownProfile } from '../../../routes/components/Dropdowns/DropdownProfile';
import { randomAvatar } from '../../../utilities';
import { ErrorBoundary } from 'react-error-boundary';
import GluuErrorFallBack from './GluuErrorFallBack';

function GluuNavBar({ themeColor, themeStyle, userinfo }) {
  const userInfo = userinfo ? userinfo : {};
  const [showCollapse, setShowCollapse] = useState(
    window.matchMedia('(max-width: 992px)').matches,
  );
  useEffect(() => {
    window
      .matchMedia('(max-width: 992px)')
      .addEventListener('change', (e) => setShowCollapse(e.matches));
  }, []);
  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <NavbarThemeProvider
        style={themeStyle}
        color={themeColor}
        className="shadow-sm"
      >
        <Navbar expand="lg" themed>
          <Nav>
            {showCollapse && (
              <NavItem className="mr-3">
                <SidebarTrigger id="navToggleBtn" />
              </NavItem>
            )}
          </Nav>
          <Nav className="ml-auto" pills>
            {/*<NavbarMessages  />*/}
            {/*<NavbarActivityFeed />*/}
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
              <DropdownProfile right userinfo={userInfo} />
            </UncontrolledDropdown>
          </Nav>
        </Navbar>
      </NavbarThemeProvider>
    </ErrorBoundary>
  );
}

GluuNavBar.propTypes = {
  navStyle: PropTypes.oneOf(['pills', 'accent', 'default']),
  themeStyle: PropTypes.string,
  themeColor: PropTypes.string,
};
GluuNavBar.defaultProps = {
  navStyle: 'default',
  themeStyle: 'dark',
  themeColor: 'primary',
};

const mapStateToProps = ({ authReducer }) => {
  const userinfo = authReducer.userinfo;
  return {
    userinfo,
  };
};
export default connect(mapStateToProps)(GluuNavBar);
