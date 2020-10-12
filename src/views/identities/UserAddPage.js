import React from "react";
import { Container, Row, Col } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import UserFormLeft from "../../components/user/UserFormLeft";
import UserFormRight from "../../components/user/UserFormRight";
import { useTranslation } from "react-i18next";
const UserAddPage = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title={t("form.userAddFormTitle")}
          subtitle="IDENTITIES"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="8">
          <UserFormLeft />
        </Col>
        <Col lg="4">
          <UserFormRight handler={selectCustomAttribute} />
        </Col>
      </Row>
    </Container>
  );
};
function selectCustomAttribute(attribute) {
  alert(attribute + " has been selected");
}
export default UserAddPage;
