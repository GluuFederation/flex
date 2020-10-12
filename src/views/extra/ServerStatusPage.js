import React from "react";
import {
  Container,
  Row,
  Col,
  CardHeader,
  Card,
  ListGroup,
  ListGroupItem,
  Form,
  FormInput,
  FormSelect
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";

const ServerStatusPage = ({ children, noNavbar, noFooter }) => (
  <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-1">
      <PageTitle
        title=""
        subtitle="IDENTITIES"
        md="12"
        className="ml-sm-auto mr-sm-auto"
      />
    </Row>
    <Row>
      <Col lg="12">
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0" style={{fontWeight:"bold"}}>Gluu Server Status</h6>
          </CardHeader>
          <ListGroup flush>
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form>
                    <Row form>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname" style={{fontWeight:"bold"}}>Host name</label>
                      </Col>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname">gluu.gasmyr.com</label>
                      </Col>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname" style={{fontWeight:"bold"}}>Polling Interval</label>
                      </Col>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname">60 seconds</label>
                      </Col>
                    </Row>
                    <Row form>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname" style={{fontWeight:"bold"}}>IP address</label>
                      </Col>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname">192.168.1.22</label>
                      </Col>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname" style={{fontWeight:"bold"}}>Person count</label>
                      </Col>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname">1</label>
                      </Col>
                    </Row>
                    <Row form>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname" style={{fontWeight:"bold"}}>System uptime</label>
                      </Col>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname">7 d 12 h 46 m 30 s</label>
                      </Col>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname" style={{fontWeight:"bold"}}>Group count</label>
                      </Col>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname">1</label>
                      </Col>
                    </Row>
                    <Row form>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname" style={{fontWeight:"bold"}}>Free disk space</label>
                      </Col>
                      <Col md="3" className="form-group">
                        <label htmlFor="displayname">24%</label>
                      </Col>
                    </Row>
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
export default ServerStatusPage;
