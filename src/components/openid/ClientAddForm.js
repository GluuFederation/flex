import React, { useState } from "react";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox
} from "shards-react";
import { Panel } from "primereact/panel";
import ControlPanel from "../common/ControlPanel";

const ClientAddForm = ({ title }) => {
  const [preAuthorization, setPreAuthorization] = useState(false);
  const [persitClientAuth, setPersitClientAuth] = useState(false);
  const [expirableClient, setExpirableClient] = useState(false);
  return (
    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="name">Client Name</label>
                    <FormInput id="name" placeholder="client name" />
                  </Col>
                  <Col md="6" className="form-group">
                    <label htmlFor="status">Client type</label>
                    <FormSelect id="feInputState">
                      <option>Choose...</option>
                      <option>Web</option>
                      <option>native</option>
                    </FormSelect>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="description">Description</label>
                    <FormTextarea
                      id="description"
                      placeholder="client description"
                    />
                  </Col>
                  <Col md="2" className="form-group">
                    <label htmlFor="preAuthorization">Pre-Authorization</label>
                  </Col>
                  <Col md="1" className="form-group">
                    <FormCheckbox
                      id="preAuthorization"
                      inline
                      checked={preAuthorization}
                      onChange={e => setPreAuthorization(!preAuthorization)}
                    />
                  </Col>
                  <Col md="2" className="form-group">
                    <label htmlFor="persitClientAuth">
                      Persist Client Authorizations
                    </label>
                  </Col>
                  <Col md="1" className="form-group">
                    <FormCheckbox
                      id="persitClientAuth"
                      inline
                      checked={persitClientAuth}
                      onChange={e => setPersitClientAuth(!persitClientAuth)}
                    />
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="subjecttye">Subject type</label>
                    <FormSelect id="subjecttye">
                      <option>Choose...</option>
                      <option>pairwise</option>
                      <option>public</option>
                    </FormSelect>
                  </Col>
                  <Col md="6" className="form-group">
                    <label htmlFor="authendmethod">
                      Authentication method for the Token Endpoint
                    </label>
                    <FormSelect id="authendmethod">
                      <option>Choose...</option>
                      <option>client_secret_basic</option>
                      <option>client_secret_post</option>
                      <option>client_secret_jwt</option>
                      <option>private_key_jwt</option>
                      <option>none</option>
                    </FormSelect>
                  </Col>
                </Row>
                <Row form>
                  <Col md="4" className="form-group">
                    <label
                      htmlFor="expirableClient"
                      style={{ marginTop: "20px" }}
                    >
                      Expirable client(NB: expirable clients are delete
                      automatically when expired.)
                    </label>
                  </Col>
                  <Col
                    md="2"
                    className="form-group"
                    style={{ marginTop: "20px" }}
                  >
                    <FormCheckbox
                      id="expirableClient"
                      inline
                      checked={expirableClient}
                      onChange={e => setExpirableClient(!expirableClient)}
                    />
                  </Col>
                  {expirableClient &&
                  <Col md="6" className="form-group">
                    <label htmlFor="logoUri">Client Expiration Date</label>
                    <FormInput
                      id="logoUri"
                      placeholder="enter Client Expiration Date"
                    />
                  </Col>
                  }
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="logoUri">Logo URI</label>
                    <FormInput id="logoUri" placeholder="Enter logo Uri" />
                  </Col>
                  <Col md="6" className="form-group">
                    <label htmlFor="policyUri">Policy URI</label>
                    <FormInput id="policyUri" placeholder="Enter policy Uri" />
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <Panel header="Scopes" toggleable={true}></Panel>
                  </Col>
                  <Col md="6" className="form-group">
                    <Panel header="Response Types" toggleable={true}></Panel>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <Panel header="Grant Types" toggleable={true}></Panel>
                  </Col>
                  <Col md="6" className="form-group">
                    <Panel header="Redirect URIs" toggleable={true}></Panel>
                  </Col>
                </Row>
                <ControlPanel />
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
};

export default ClientAddForm;
