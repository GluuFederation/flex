import React from "react";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import HeaderNavbar from "../components/layout/HeaderNavbar/HeaderNavbar";
import MainFooter from "../components/layout/MainFooter";

import { LAYOUT_TYPES } from "../utils/constants";
import getHeaderNavbarItems from "../data/header-nav-items";

export default ({ children }) => (
  <Container fluid>
    <Row>
      <Col tag="main" className="main-content p-0" lg="12" md="12" sm="12">
        <MainNavbar layout={LAYOUT_TYPES.HEADER_NAVIGATION} />
        <HeaderNavbar items={getHeaderNavbarItems()} />
          {children}
        <MainFooter />
      </Col>
    </Row>
  </Container>
);
