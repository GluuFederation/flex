import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Form,
  FormInput,
  FormCheckbox,
  FormTextarea,
  FormSelect
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import ControlPanel from "../../components/common/ControlPanel";
import { Panel } from "primereact/panel";

const OpenIdScopeAddPage = () => {
  const [isDynamic, setIsDynamic] = useState(false);
  const [scopeType, setScopeType] = useState("OAuth");
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="OPENID SCOPE ADD FORM"
          subtitle="SSO"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="12">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">OPENID SCOPE ADD FORM</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <Form>
                      <Row form>
                        <Col md="8" className="form-group">
                          <label htmlFor="displayname">Display Name</label>
                          <FormInput
                            id="displayname"
                            placeholder="display Name"
                          />
                        </Col>
                        <Col md="4" className="form-group">
                          <label htmlFor="scopeType">Scope type</label>
                          <FormSelect
                            id="scopeType"
                            onChange={e => setScopeType(e.target.value)}
                            value={scopeType}
                          >
                            <option>Choose...</option>
                            <option value="OpenID">OpenID</option>
                            <option value="Dynamic">Dynamic</option>
                            <option value="OAuth">OAuth</option>
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="8" className="form-group">
                          <label htmlFor="description">Description</label>
                          <FormTextarea
                            id="description"
                            placeholder="Attribute description"
                          />
                        </Col>
                        <Col
                          md="3"
                          className="form-group"
                          style={{ paddingTop: "30px" }}
                        >
                          <label htmlFor="isDynamic">
                            Allow for dynamic registration
                          </label>
                        </Col>
                        <Col
                          md="1"
                          className="form-group"
                          style={{ paddingTop: "30px" }}
                        >
                          <FormCheckbox
                            id="isDynamic"
                            checked={isDynamic}
                            onChange={e => setIsDynamic(!isDynamic)}
                          />
                        </Col>
                      </Row>
                      {(scopeType === "OpenID" || scopeType === "Dynamic")  && (
                        <Row form>
                          <Col md="12" className="form-group">
                            <Panel header="Claims" toggleable={true}></Panel>
                          </Col>
                        </Row>
                      )}
                      {scopeType === "Dynamic" && (
                        <Row form>
                          <Col md="12" className="form-group">
                            <Panel
                              header="Dynamics scope scripts"
                              toggleable={true}
                            ></Panel>
                          </Col>
                        </Row>
                      )}
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

export default OpenIdScopeAddPage;
