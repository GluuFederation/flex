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
import { Panel } from "primereact/panel";
import { TabView, TabPanel } from "primereact/tabview";
import PageTitle from "../../components/common/PageTitle";
import ControlPanel from "../../components/common/ControlPanel";
import { Button } from "react-bootstrap";
const TrustAddPage = () => {
  const [configureRelyingParty, setConfigureRelyingParty] = useState(false);
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="TRUST ADD FORM"
          subtitle="SSO"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="7">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">TRUST ADD FORM</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <Form>
                      <Row form>
                        <Col md="12" className="form-group">
                          <label htmlFor="displayName">Display Name</label>
                          <FormInput
                            id="displayName"
                            placeholder="Enter display name"
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="12" className="form-group">
                          <label htmlFor="description">Description</label>
                          <FormTextarea
                            id="description"
                            placeholder="Enter description"
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="entytiType">Entity Type</label>
                          <FormSelect id="entytiType">
                            <option>Choose...</option>
                            <option>Single SP</option>
                            <option>Federation/Aggregate</option>
                          </FormSelect>
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="metadataType">Metadata Type</label>
                          <FormSelect id="metadataType">
                            <option>Choose...</option>
                            <option>None</option>
                            <option>URI</option>
                            <option>File</option>
                            <option>Federation</option>
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="12" className="form-group">
                          <label htmlFor="metadataType">
                            SP Logout URL (optional)
                          </label>
                          <FormInput
                            id="spLogoutUrl"
                            placeholder="Enter SP Logout Url"
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="metadataType">
                            Configure Relying Party
                          </label>
                        </Col>
                        <Col md="2" className="form-group">
                          <FormCheckbox
                            id="configureRelyingParty"
                            inline
                            checked={configureRelyingParty}
                            onChange={e =>
                              setConfigureRelyingParty(!configureRelyingParty)
                            }
                          />
                        </Col>
                        {configureRelyingParty && (
                          <Col md="6" className="form-group">
                            <Button>Configure Relying Party</Button>
                          </Col>
                        )}
                      </Row>
                      <Row form>
                        <Col md="12" className="form-group">
                          <Panel
                            header="Released attributes"
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
        <Col lg="5">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Release additional attributes</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <TabView>
                  <TabPanel header="GluuPerson">Realease I</TabPanel>
                  <TabPanel header="GluuCustomPerson">Realease II</TabPanel>
                </TabView>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default TrustAddPage;
