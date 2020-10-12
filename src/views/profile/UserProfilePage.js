import React from "react";
import { Container, Row, Col } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import UserDetails from "../../components/user-profile-lite/UserDetails";
import UserAccountDetails from "../../components/user-profile-lite/UserAccountDetails";

const UserProfilePage = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="MY PROFILE"
          subtitle="IDENTITIES"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="4">
          <UserDetails />
        </Col>
        <Col lg="8">
          <UserAccountDetails />
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfilePage;
