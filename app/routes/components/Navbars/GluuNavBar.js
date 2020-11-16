import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  AvatarAddOn,
  DropdownToggle,
  NavbarThemeProvider,
  Navbar,
  Nav,
  UncontrolledDropdown
} from "../../../components";

import { NavbarActivityFeed } from "../../../layout/components/NavbarActivityFeed";
import { NavbarMessages } from "../../../layout/components/NavbarMessages";
import { DropdownProfile } from "../Dropdowns/DropdownProfile";

import { randomAvatar } from "../../../utilities";

const GluuNavBar = ({ themeColor, themeStyle }) => {
  return (
    <NavbarThemeProvider
      style={themeStyle}
      color={themeColor}
      className="shadow-sm"
    >
      <Navbar expand="lg" themed>
        {/* END Navbar: Left Side */}
        {/* START Navbar: Right Side */}
        <Nav className="ml-auto" pills>
          <NavbarMessages />
          <NavbarActivityFeed />
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
            <DropdownProfile right />
          </UncontrolledDropdown>
        </Nav>
        {/* END Navbar: Right Side */}
      </Navbar>
    </NavbarThemeProvider>
  );
};

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

export { GluuNavBar };
