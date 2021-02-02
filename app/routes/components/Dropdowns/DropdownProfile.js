import React from "react";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { DropdownMenu, DropdownItem } from "./../../../components";

const DropdownProfile = props => (
  <React.Fragment>
    <DropdownMenu right={props.right}>
      <DropdownItem header>
        {props.userinfo.user_name}-{props.userinfo.email}
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem tag={Link} to="/apps/profile-details">
        My Profile
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem tag={Link} to="/pages/logout">
        <i className="fa fa-fw fa-sign-out mr-2"></i>
        Sign Out
      </DropdownItem>
    </DropdownMenu>
  </React.Fragment>
);
DropdownProfile.propTypes = {
  position: PropTypes.string,
  right: PropTypes.bool
};
DropdownProfile.defaultProps = {
  position: ""
};

export { DropdownProfile };
