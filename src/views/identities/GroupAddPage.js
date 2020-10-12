import React from "react";
import { Container, Row, Col } from "shards-react";
import { useTranslation } from "react-i18next";
import PageTitle from "../../components/common/PageTitle";
import GroupFormLeft from "../../components/group/GroupFormLeft";
import GroupFormRight from "../../components/group/GroupFormRight";

const GroupAddPage = () => {
  const { t } = useTranslation();
  const users = [
    "Audi",
    "BMW",
    "Fiat",
    "Ford",
    "Honda",
    "Jaguar",
    "Mercedes",
    "Renault",
    "Volvo"
  ];
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="GROUP ADD FORM"
          subtitle="IDENTITIES"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="8">
          <GroupFormLeft />
        </Col>
        <Col lg="4">
          <GroupFormRight users={users} />
        </Col>
      </Row>
    </Container>
  );
};

export default GroupAddPage;
