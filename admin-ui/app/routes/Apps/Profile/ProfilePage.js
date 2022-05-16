import React from 'react'
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
} from 'Components'
import { HeaderMain } from 'Routes/components/HeaderMain'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from '../Gluu/GluuErrorFallBack'
import { Profile } from 'Routes/components/Profile'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

const ProfileDetails = ({ userinfo }) => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
        <Container>
          <HeaderMain
            title={t('titles.profile_detail')}
            className="mb-5 mt-4"
          />
          <Row>
            <Col lg={4}>
              <Card>
                <CardBody>
                  <Profile userinfo={userinfo} />
                  <div className="text-center pb-1"></div>
                  <div className="mt-4 mb-2">
                    <span className="small">
                      {t('titles.detail_information')}
                    </span>
                  </div>
                  <div className="text-left mb-4">
                    <Badge pill color="info" className="mr-1">
                      {userinfo.family_name}
                    </Badge>
                    <Badge pill color="info" className="mr-1">
                      {userinfo.nickname}
                    </Badge>
                    <Badge pill color="info" className="mr-1">
                      {userinfo.name}
                    </Badge>
                    <Badge pill color="info" className="mr-1">
                      {userinfo.middle_name}
                    </Badge>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={8}>
              <UncontrolledTabs initialActiveTabId="detailContact">
                <Nav
                  pills
                  className="mb-4 flex-column flex-md-row mt-4 mt-lg-0"
                >
                  <NavItem>
                    <UncontrolledTabs.NavLink tabId="detailContact">
                      {t('titles.detail_contact')}
                    </UncontrolledTabs.NavLink>
                  </NavItem>
                </Nav>
                <UncontrolledTabs.TabContent>
                  <TabPane tabId="detailContact">
                    <Card body>
                      <div className="mb-2">
                        <span className="small">
                          {t('titles.config_api_roles')}
                        </span>
                      </div>
                      {userinfo.jansAdminUIRole &&
                        userinfo.jansAdminUIRole.map((role, index) => (
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
                        <span className="small">
                          {t('titles.detail_information')}
                        </span>
                      </div>
                      <div className="text-left mb-4">
                        <Badge pill color="info" className="mr-1">
                          {userinfo.family_name}
                        </Badge>
                        <Badge pill color="info" className="mr-1">
                          {userinfo.nickname}
                        </Badge>
                        <Badge pill color="info" className="mr-1">
                          {userinfo.name}
                        </Badge>
                        <Badge pill color="info" className="mr-1">
                          {userinfo.middle_name}
                        </Badge>
                      </div>
                    </Card>
                  </TabPane>
                </UncontrolledTabs.TabContent>
              </UncontrolledTabs>
            </Col>
          </Row>
        </Container>
      </ErrorBoundary>
    </React.Fragment>
  )
}

const mapStateToProps = ({ authReducer }) => {
  const userinfo = authReducer.userinfo
  return {
    userinfo,
  }
}

export default connect(mapStateToProps)(ProfileDetails)
