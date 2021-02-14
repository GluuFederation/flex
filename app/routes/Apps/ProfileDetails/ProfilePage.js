import React from 'react'
import { Link } from 'react-router-dom'

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  TabPane,
  Badge,
  Nav,
  NavItem,
  UncontrolledTabs,
} from '../../../components'
import { HeaderMain } from '../../components/HeaderMain'

import { Profile } from '../../components/Profile'
import { TimelineDefault } from '../../components/Timeline/TimelineDefault'
import { connect } from 'react-redux'

const ProfileDetails = ({ userinfo }) => (
  <React.Fragment>
    <Container>
      <HeaderMain title="Profile Details" className="mb-5 mt-4" />
      {/* START Content */}
      <Row>
        <Col lg={4}>
          <Card>
            <CardBody>
              <Profile userinfo={userinfo} />
              <div className="text-center pb-1">
                <ul className="list-inline">
                  <li className="list-inline-item text-center">
                    <h2 className="mb-1">3</h2>
                    <span>Groups Count</span>
                  </li>
                  <li className="list-inline-item text-center">
                    <h2 className="mb-1">7</h2>
                    <span>Login count</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 mb-2">
                <span className="small">Informations</span>
              </div>
              <div className="text-left mb-4">
                <Badge pill color="info" className="mr-1">
                  {userinfo.name}
                </Badge>
                <Badge pill color="info" className="mr-1">
                  {userinfo.email}
                </Badge>
                <Badge pill color="info" className="mr-1">
                  {userinfo.user_name}
                </Badge>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={8}>
          <UncontrolledTabs initialActiveTabId="overview">
            {/* START Pills Nav */}
            <Nav pills className="mb-4 flex-column flex-md-row mt-4 mt-lg-0">
              <NavItem>
                <UncontrolledTabs.NavLink tabId="overview">
                  Latest activities
                </UncontrolledTabs.NavLink>
              </NavItem>
              <NavItem>
                <UncontrolledTabs.NavLink tabId="detailContact">
                  Detail Contact
                </UncontrolledTabs.NavLink>
              </NavItem>
            </Nav>
            {/* END Pills Nav */}
            <UncontrolledTabs.TabContent>
              <TabPane tabId="overview">
                <TimelineDefault
                  showPillDate
                  pillDate="Today"
                  smallIconColor="danger"
                  iconCircleColor="danger"
                  iconCircle="exclamation"
                />
                <TimelineDefault
                  showPillDate
                  pillDate="Yesterday"
                  smallIconColor="info"
                  iconCircleColor="info"
                  iconCircle="comment"
                />
              </TabPane>
              <TabPane tabId="detailContact">
                <Card body>
                  <div className="mb-2">
                    <span className="small">Config api roles</span>
                  </div>
                  {userinfo.jansAdminUIRole.map((role, index) => (
                    <Badge
                      style={{ width: '100px' }}
                      color="info"
                      className="mr-1"
                      key={index}
                    >
                      {role}
                    </Badge>
                  ))}
                  <div className="mt-4 mb-2">
                    <span className="small">Informations</span>
                  </div>
                  {}
                </Card>
              </TabPane>
            </UncontrolledTabs.TabContent>
          </UncontrolledTabs>
        </Col>
      </Row>
      {/* END Content */}
    </Container>
  </React.Fragment>
)

const mapStateToProps = ({ authReducer }) => {
  const userinfo = authReducer.userinfo
  return {
    userinfo,
  }
}

export default connect(mapStateToProps)(ProfileDetails)
