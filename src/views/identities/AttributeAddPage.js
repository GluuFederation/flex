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
  FormSelect,
  Slider
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import ControlPanel from "../../components/common/ControlPanel";
import { useTranslation } from "react-i18next";
const AttributeAddPage = () => {
  const { t } = useTranslation();
  const [multivalued, setMultivalued] = useState(false);
  const [includeInScim, setIncludeInScim] = useState(false);
  const [enableRegex, setEnableRegex] = useState(false);
  const [enableTooltip, setEnableTooltip] = useState(false);
  const [minimum, setMinimum] = useState(2);
  const [maximum, setMaximum] = useState(minimum);
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="ATTRIBUTE ADD FORM"
          subtitle="IDENTITIES"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="12">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">ATTRIBUTE ADD FORM</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <Form>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="name">Name</label>
                          <FormInput id="name" placeholder="attribute name" />
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="displayname">Display Name</label>
                          <FormInput
                            id="displayname"
                            placeholder="display Name"
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="12" className="form-group">
                          <label htmlFor="description">Description</label>
                          <FormTextarea
                            id="description"
                            placeholder="Attribute description"
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="2" className="form-group">
                          <label htmlFor="password">
                            Multivalued Attribute
                          </label>
                        </Col>
                        <Col md="4" className="form-group">
                          <FormCheckbox
                            id="multivalued"
                            inline
                            checked={multivalued}
                            onChange={e => setMultivalued(!multivalued)}
                          />
                        </Col>
                        <Col md="2" className="form-group">
                          <label htmlFor="claimname">
                            Include in SCIM extension
                          </label>
                        </Col>
                        <Col md="4" className="form-group">
                          <FormCheckbox
                            id="includeInScim"
                            inline
                            checked={includeInScim}
                            onChange={e => setIncludeInScim(!includeInScim)}
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="2" className="form-group">
                          <label htmlFor="password">
                            Enable custom validation for this attribute
                          </label>
                        </Col>
                        <Col md="1" className="form-group">
                          <FormCheckbox
                            id="enableRegex"
                            inline
                            checked={enableRegex}
                            onChange={e => setEnableRegex(!enableRegex)}
                          />
                        </Col>
                        <Col md="3" className="form-group">
                          {enableRegex && (
                            <FormInput
                              id="regex"
                              type="text"
                              placeholder="Enter the regular expression"
                            />
                          )}
                        </Col>
                        <Col md="2" className="form-group">
                          <label htmlFor="claimname">
                            Enable tooltip for this attribute
                          </label>
                        </Col>
                        <Col md="1" className="form-group">
                          <FormCheckbox
                            id="enableTooltip"
                            inline
                            checked={enableTooltip}
                            onChange={e => setEnableTooltip(!enableTooltip)}
                          />
                        </Col>
                        <Col md="3" className="form-group">
                          {enableTooltip && (
                            <FormInput
                              id="tooltip"
                              type="text"
                              placeholder="Enter tooltip Text"
                            />
                          )}
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="claimname">oxAuth claim name</label>
                          <FormInput
                            type="text"
                            id="claimname"
                            placeholder="oxauth claim name"
                          />
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="status">Regex Pattern</label>
                          <FormInput
                            type="text"
                            id="regexpattern"
                            placeholder="Enter regex pattern"
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="status">Attribute type</label>
                          <FormSelect id="feInputState">
                            <option>Choose...</option>
                            <option>Text</option>
                            <option>Numeric</option>
                            <option>Boolean</option>
                            <option>Binary</option>
                            <option>Certicates</option>
                            <option>Date</option>
                          </FormSelect>
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="status">Status</label>
                          <FormSelect id="feInputState">
                            <option>Choose...</option>
                            <option>Active</option>
                            <option>InActive</option>
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <p>Minimum Length: {minimum}</p>
                          <Slider
                            onSlide={e => setMinimum(parseInt(e[0]))}
                            theme="success"
                            connect={[true, false]}
                            start={minimum}
                            range={{ min: 0, max: 100 }}
                          />
                        </Col>
                        <Col md="6" className="form-group">
                          <p>Maximum Length: {maximum}</p>
                          <Slider
                            onSlide={e => setMaximum(parseInt(e[0]))}
                            theme="success"
                            connect={[true, false]}
                            start={minimum}
                            range={{ min: minimum, max: 100 }}
                          />
                        </Col>
                      </Row>
                      <ControlPanel></ControlPanel>
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

export default AttributeAddPage;
