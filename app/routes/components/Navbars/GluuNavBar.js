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
import { DropdownProfile } from "../Dropdowns/DropdownProfile";

import { randomAvatar } from "../../../utilities";
const JansConfigApi = require("jans_config_api");
const defaultClient = JansConfigApi.ApiClient.instance;
defaultClient.timeout = 80000;
const jansauth = defaultClient.authentications["jans-auth"];
jansauth.accessToken = "f1e08391-47be-4c51-9ce3-1013b1badad7";
defaultClient.basePath = "https://gluu.gasmyr.com".replace(/\/+$/, "");

defaultClient.defaultHeaders = "{'Access-Control-Allow-Origin', '*'}";

const GluuNavBar = ({ themeColor, themeStyle }) => {
  useEffect(() => {
    const api = new JansConfigApi.OAuthScopesApi();
    const inum = "43F1"; // {String} scope ID.
    const callback = function(error, data, res) {
      if (error) {
        console.error("====================================++");
        console.error(error);
        console.error(JSON.stringify(error));
      } else {
        console.info("=======data ===>" + JSON.stringify(data));
        console.info("=======response" + JSON.stringify(res));
        console.log("API called successfully.");
      }
    };
    api.getOauthScopesByInum(inum, callback);
  });
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
