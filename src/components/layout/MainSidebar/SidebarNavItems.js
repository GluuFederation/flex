import React from "react";
import { Nav } from "shards-react";
import SidebarNavItem from "./SidebarNavItem";
import { withTranslation } from "react-i18next";
import { Store } from "../../../flux";
class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navItems: Store.getSidebarItems()
    };
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      navItems: Store.getSidebarItems()
    });
  }

  render() {
    const { navItems: items } = this.state;
    const { t } = this.props;
    return (
      <div className="nav-wrapper">
        {items.map((nav, idx) => (
          <div key={idx}>
            <h6 className="main-sidebar__nav-title">{t(nav.title)}</h6>
            {typeof nav.items !== "undefined" && nav.items.length && (
              <Nav className="nav--no-borders flex-column">
                {nav.items.map((item, idx) => (
                  <SidebarNavItem key={idx} item={item} />
                ))}
              </Nav>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default withTranslation()(SidebarNavItems);
