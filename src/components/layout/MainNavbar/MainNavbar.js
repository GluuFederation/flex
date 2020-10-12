import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar, NavbarBrand } from "shards-react";

import NavbarSearch from "./NavbarSearch";
import NavbarNav from "./NavbarNav/NavbarNav";
import NavbarToggle from "./NavbarToggle";

import { LAYOUT_TYPES } from "../../../utils/constants";

const MainNavbar = ({ layout, stickyTop }) => {
  const isHeaderNav = layout === LAYOUT_TYPES.HEADER_NAVIGATION;
  const classes = classNames(
    "main-navbar",
    "bg-white",
    stickyTop && "sticky-top"
  );

  return (
    <div className={classes}>
      <Container fluid={!isHeaderNav || null} className="p-0">
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
          {isHeaderNav && (
            <NavbarBrand href="#" style={{ lineHeight: "25px" }}>
              <div className="d-table m-auto">
                <img
                  id="main-logo"
                  className="d-inline-block align-top mr-1 ml-3"
                  style={{ maxWidth: "25px" }}
                  src={require("../../../images/logo.png")}
                  alt="oxTrust2"
                />
                <span className="d-none d-md-inline ml-1">oxTrust2</span>
              </div>
            </NavbarBrand>
          )}
          <NavbarSearch />
          <NavbarNav />
          <NavbarToggle />
        </Navbar>
      </Container>
    </div>
  );
};

MainNavbar.propTypes = {
  layout: PropTypes.string,
  stickyTop: PropTypes.bool
};

MainNavbar.defaultProps = {
  stickyTop: true
};

export default MainNavbar;
