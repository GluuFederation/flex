import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  AvatarAddOn,
  DropdownToggle,
  NavbarThemeProvider,
  Navbar,
  Nav,
  NavItem,
  SidebarTrigger,
  UncontrolledDropdown
} from "../../../components";
import { NavbarActivityFeed } from "../../../layout/components/NavbarActivityFeed";
import { NavbarMessages } from "../../../layout/components/NavbarMessages";
import { LanguageMenu } from "./LanguageMenu";
import { connect } from "react-redux";
import { DropdownProfile } from "../Dropdowns/DropdownProfile";
import { randomAvatar } from "../../../utilities";
function GluuNavBar({ themeColor, themeStyle, userinfo }) {
  return (
    <NavbarThemeProvider
      style={themeStyle}
      color={themeColor}
      className="shadow-sm"
    >
      <Navbar expand="lg" themed>
        {/* END Navbar: Left Side */}
        <Nav>
          <NavItem className="mr-3">
            <SidebarTrigger />
          </NavItem>
        </Nav>
        {/* START Navbar: Right Side */}
        <Nav className="ml-auto" pills>
          <NavbarMessages />
          <NavbarActivityFeed />
          <LanguageMenu />
          {/* START Navbar: Dropdown */}
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
                  />
                ]}
              />
            </DropdownToggle>
            <DropdownProfile right userinfo={userinfo} />
          </UncontrolledDropdown>
        </Nav>
        {/* END Navbar: Right Side */}
      </Navbar>
    </NavbarThemeProvider>
  );
}

GluuNavBar.propTypes = {
  navStyle: PropTypes.oneOf(["pills", "accent", "default"]),
  themeStyle: PropTypes.string,
  themeColor: PropTypes.string
};
GluuNavBar.defaultProps = {
  navStyle: "default",
  themeStyle: "dark",
  themeColor: "primary"
};

const mapStateToProps = ({ authReducer }) => {
  const userinfo = authReducer.userinfo;
  return {
    userinfo
  };
};
export default connect(mapStateToProps)(GluuNavBar);
