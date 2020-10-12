import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";

const UserActions = () => {
  const [visible, setVisible] = useState(false);
  return (
    <NavItem tag={Dropdown} caret toggle={() => setVisible(!visible)}>
      <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
        <img
          className="user-avatar rounded-circle mr-2"
          src={require("./../../../../images/user.jpeg")}
          alt="User Avatar"
        />{" "}
        <span className="d-none d-md-inline-block">Zico</span>
      </DropdownToggle>
      <Collapse tag={DropdownMenu} right small open={visible}>
        <DropdownItem tag={Link} to="/me">
          <i className="material-icons">&#xE7FD;</i> Profile
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/changepw">
          <i className="material-icons">lock</i>Change password
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/" className="text-danger">
          <i className="material-icons text-danger">&#xE879;</i> Logout
        </DropdownItem>
      </Collapse>
    </NavItem>
  );
};
export default UserActions;
