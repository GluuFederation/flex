import React from "react";
import PageTitle from "../../components/common/PageTitle";
import { Panel } from "primereact/panel";
import ControlPanel from "../../components/common/ControlPanel";
import "../../css/theme.css";
import "primereact/resources/primereact.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Form,
  Button,
  FormTextarea
} from "shards-react";
const OpenIdSectorAddPage = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="OPENID SECTOR ADD FORM"
          subtitle="SSO"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="12">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">OPENID SECTOR ADD FORM</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <Form>
                      <Row form>
                        <Col md="12" className="form-group">
                          <label htmlFor="description">Description</label>
                          <FormTextarea
                            id="description"
                            placeholder="description"
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col
                          md="6"
                          className="form-group"
                          style={{ paddingTop: "30px" }}
                        >
                          <Panel header="Redirect login URIs" toggleable={true}>
                            <Button>add</Button>
                          </Panel>
                        </Col>
                        <Col
                          md="6"
                          className="form-group"
                          style={{ paddingTop: "30px" }}
                        >
                          <Panel header="Clients" toggleable={true}>
                            <Button>add</Button>
                          </Panel>
                        </Col>
                      </Row>
                      <ControlPanel />
                    </Form>
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

export default OpenIdSectorAddPage;
