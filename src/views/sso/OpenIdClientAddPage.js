import React from "react";
import { Container, Row, Col } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import ClientAddForm from "../../components/openid/ClientAddForm";
const OpenIdClientAddPage = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="OPENID CLIENT ADD FORM"
          subtitle="SSO"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="12">
          <ClientAddForm title="OPENID CLIENT ADD FORM" />
        </Col>
      </Row>
    </Container>
  );
};

export default OpenIdClientAddPage;
