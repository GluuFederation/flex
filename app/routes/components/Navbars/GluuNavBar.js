import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  Avatar,
  AvatarAddOn,
  DropdownToggle,
  NavbarThemeProvider,
  Navbar,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  UncontrolledCollapse,
  UncontrolledDropdown
} from "../../../components";

import { NavbarActivityFeed } from "../../../layout/components/NavbarActivityFeed";
import { NavbarMessages } from "../../../layout/components/NavbarMessages";
import { NavbarUser } from "../../../layout/components/NavbarUser";
import { NavbarNavigation } from "./NavbarNavigation";
import { DropdownProfile } from "../Dropdowns/DropdownProfile";

import { randomAvatar } from "../../../utilities";

const GluuNavBar = ({ themeColor, themeStyle, navStyle }) => {
  return (
    <NavbarThemeProvider
      style={themeStyle}
      color={themeColor}
      className="shadow-sm"
    >
      <Navbar expand="lg" themed>
        <Nav pills>
          <NavItem>
            <NavLink
              tag={NavbarToggler}
              id="navbar-navigation-toggler"
              className="b-0"
            >
              <i className="fa fa-fw fa-bars"></i>
            </NavLink>
          </NavItem>
        </Nav>

        {/* Navigation with Collapse */}
        <UncontrolledCollapse navbar toggler="#navbar-navigation-toggler">
          <NavbarNavigation
            pills={navStyle === "pills"}
            accent={navStyle === "accent"}
          />
        </UncontrolledCollapse>

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
                    color="danger"
                    key="avatar-icon-fg"
                  />
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
