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
  FormSelect
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import ControlPanel from "../../components/common/ControlPanel";
import { Panel } from "primereact/panel";
const ProviderAddPage = () => {
  const [isEnable, setIsEnable] = useState(false);
  const [emailLinking, setEmailLinking] = useState(false);
  const [requestEmail, setRequestEmail] = useState(false);
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="PROVIDER ADD FORM"
          subtitle="SSO"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="12">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">PROVIDER ADD FORM</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <Form>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="providerId">ProviderId</label>
                          <FormInput
                            id="displayName"
                            placeholder="Enter provider id"
                          />
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="displayName">Display Name</label>
                          <FormInput
                            id="displayName"
                            placeholder="Enter display name"
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="type">Type</label>
                          <FormSelect id="type">
                            <option>Choose...</option>
                            <option>saml</option>
                            <option>openidconnect</option>
                            <option>openidconnect-oxd</option>
                            <option>oauth</option>
                          </FormSelect>
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="strategy">Passport Js Strategy</label>
                          <FormInput
                            id="strategy"
                            placeholder="Enter strategy"
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="mapping">Mapping</label>
                          <FormInput id="mapping" placeholder="Enter mapping" />
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="logoPath">Logo path</label>
                          <FormInput
                            id="logoPath"
                            placeholder="Enter logo path"
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="authParam">Authenticate Params</label>
                          <FormInput
                            id="authParam"
                            placeholder="Enter authenticate params"
                          />
                        </Col>
                        <Col
                          md="2"
                          className="form-group"
                          style={{ marginTop: "25px" }}
                        >
                          <label htmlFor="metadataType">Is Enabled</label>
                        </Col>
                        <Col
                          md="4"
                          className="form-group"
                          style={{ marginTop: "25px" }}
                        >
                          <FormCheckbox
                            id="isEnable"
                            checked={isEnable}
                            onChange={e => setIsEnable(!isEnable)}
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col
                          md="2"
                          className="form-group"
                          style={{ marginTop: "25px" }}
                        >
                          <label htmlFor="metadataType">
                            Request For Email
                          </label>
                        </Col>
                        <Col
                          md="4"
                          className="form-group"
                          style={{ marginTop: "25px" }}
                        >
                          <FormCheckbox
                            id="requestEmail"
                            checked={requestEmail}
                            onChange={e => setRequestEmail(!requestEmail)}
                          />
                        </Col>
                        <Col
                          md="2"
                          className="form-group"
                          style={{ marginTop: "25px" }}
                        >
                          <label htmlFor="emailLinking">Email linking</label>
                        </Col>
                        <Col
                          md="4"
                          className="form-group"
                          style={{ marginTop: "25px" }}
                        >
                          <FormCheckbox
                            id="emailLinking"
                            checked={emailLinking}
                            onChange={e => setEmailLinking(!emailLinking)}
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="12" className="form-group">
                          <Panel
                            header="Providers options"
                            toggleable={true}
                          ></Panel>
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

export default ProviderAddPage;
