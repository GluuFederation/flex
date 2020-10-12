import React from "react";
import PropTypes from "prop-types";
import { NavLink as RouteNavLink } from "react-router-dom";
import {
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "shards-react";

class MenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { item } = this.props;

    if (item.items) {
      return (
        <Dropdown className="nav-item" open={this.state.open} toggle={this.toggleDropdown}>
          <DropdownToggle nav caret>
            {item.htmlBefore && (
              <div
                className="d-inline-block"
                dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
              />
            )}
            {item.title}
          </DropdownToggle>
          <DropdownMenu small>
            {item.items.map((item, idx) => (
              <DropdownItem key={idx} tag={RouteNavLink} to={item.to}>
                {item.title}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      );
    }

    return (
      <NavItem>
        <NavLink tag={RouteNavLink} to={item.to} className="text-nowrap">
          {item.htmlBefore && (
            <div
              className="d-inline-block"
              dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
            />
          )}
          {item.title}
        </NavLink>
      </NavItem>
    );
  }
}

MenuItem.propTypes = {
  item: PropTypes.object
};

export default MenuItem;
