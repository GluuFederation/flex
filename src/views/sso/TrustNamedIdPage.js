import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  ButtonGroup,
  Button
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import NamedIdBox from "../../components/trust/NamedIdBox";
const TrustNamedIdPage = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title=""
          subtitle="SINGLE SIGN ON"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="12">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col sm="11">
                  <h6 className="m-0">NamedId List</h6>
                </Col>
                <Col sm="1">
                  <ButtonGroup size="sm" className="d-table mx-auto">
                    <Button
                      theme="primary"
                      className="btn-lg"
                      onClick={() => alert("Not implemeted yet.")}
                    >
                      <i class="material-icons">add</i>
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col sm="6">
                    <NamedIdBox></NamedIdBox>
                  </Col>
                  <Col sm="6">
                    <NamedIdBox></NamedIdBox>
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TrustNamedIdPage;
