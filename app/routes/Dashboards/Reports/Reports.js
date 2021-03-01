import React from 'react'

import {
  Container,
  Row,
  Card,
  CardBody,
  UncontrolledTooltip,
  Progress,
  Table,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  ListGroup,
  ListGroupItem,
  UncontrolledCollapse,
  Col,
} from './../../../components'
import { setupPage } from './../../../components/Layout/setupPage'

/*eslint-disable */
const progressCompletion = ['25', '50', '75', '97']
/*eslint-enable */

const Reports = () => (
  <Container>
    <Row>
      <Col lg={3}>
        <Card className="mb-3">
          <CardBody>
            <CardTitle tag="h6" className="mb-4">
              All OIDC Clients
            </CardTitle>
            <div>
              <div className="mb-3">
                <h2>6</h2>
              </div>
              <div>
                <i className="fa fa-caret-down fa-fw text-success"></i>2
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={3}>
        <Card className="mb-3">
          <CardBody>
            <CardTitle tag="h6" className="mb-4">
              All Attributes
            </CardTitle>
            <div>
              <div className="mb-3">
                <h2>105</h2>
              </div>
              <div>
                <i className="fa fa-caret-down fa-fw text-success"></i>55
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={3}>
        <Card className="mb-3">
          <CardBody>
            <CardTitle tag="h6" className="mb-4">
              All Scopes
            </CardTitle>
            <div>
              <div className="mb-3">
                <h2>75</h2>
              </div>
              <div>
                <i className="fa fa-caret-down fa-fw text-success"></i>55
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={3}>
        <Card className="mb-3">
          <CardBody>
            <CardTitle tag="h6" className="mb-4">
              All Custom Scripts
            </CardTitle>
            <div>
              <div className="mb-3">
                <h2>89</h2>
              </div>
              <div>
                <i className="fa fa-caret-down fa-fw text-success"></i>7
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
)

export default setupPage({
  pageTitle: 'Reports',
})(Reports)
