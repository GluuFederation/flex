import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Nav, NavItem, NavLink } from "shards-react";
import { Link } from "react-router-dom";

const MainFooter = ({ contained, menuItems, copyright }) => (
  <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
    <Container fluid={contained}>
      <Row>
        <Nav>
          {menuItems.map((item, idx) => (
            <NavItem key={idx}>
              <NavLink tag={Link} to={item.to}>
                {item.title}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <span className="copyright ml-auto my-auto mr-2">{copyright}</span>
      </Row>
    </Container>
  </footer>
);

MainFooter.propTypes = {
  contained: PropTypes.bool,
  menuItems: PropTypes.array,
  copyright: PropTypes.string
};

MainFooter.defaultProps = {
  contained: false,
  copyright: "Copyright © 2020 Gluu Inc.",
  menuItems: [
    {
      title: "Our Documentation",
      to: "https://gluu.org/docs/"
    },
    {
      title: "Our web site",
      to: "https://gluu.org"
    },
    {
      title: "Our Support portal",
      to: "https://support.gluu.org/"
    }
  ]
};

export default MainFooter;
