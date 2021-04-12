import React, { useEffect } from 'react'

import {
  Container,
  Row,
  Card,
  CardBody,
  CardTitle,
  Col,
} from './../../../components'
import { connect } from 'react-redux'
import { getAttributes } from '../../../redux/actions/AttributeActions'
import { getOpenidClients } from '../../../redux/actions/OIDCActions'
import { getScopes } from '../../../redux/actions/ScopeActions'
import { getCustomScripts } from '../../../redux/actions/CustomScriptActions'

function Reports({ attributes, clients, scopes, scripts, dispatch, plugins }) {
  useEffect(() => {
    if (attributes.length === 0) {
      dispatch(getAttributes())
    }
    if (clients.length === 0) {
      dispatch(getOpenidClients())
    }
    if (scopes.length === 0) {
      dispatch(getScopes())
    }
    if (scripts.length === 0) {
      dispatch(getCustomScripts())
    }
  }, [])

  return (
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
                  <h2>{clients.length}</h2>
                </div>
                <div>
                  <i className="fa fa-caret-down fa-fw text-success"></i>
                  {clients.filter((item) => !item.disabled).length}
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
                  <h2>{attributes.length}</h2>
                </div>
                <div>
                  <i className="fa fa-caret-down fa-fw text-success"></i>
                  {attributes.filter((item) => item.status === 'ACTIVE').length}
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
                  <h2>{scopes.length}</h2>
                </div>
                <div>
                  <i className="fa fa-caret-down fa-fw text-success"></i>
                  {scopes.filter((item) => item.scopeType === 'oauth').length}
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
                  <h2>{scripts.length}</h2>
                </div>
                <div>
                  <i className="fa fa-caret-down fa-fw text-success"></i>
                  {scripts.filter((item) => item.enabled).length}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
const mapStateToProps = (state) => {
  return {
    attributes: state.attributeReducer.items,
    clients: state.oidcReducer.items,
    scopes: state.scopeReducer.items,
    scripts: state.customScriptReducer.items,
    plugins: state.pluginMenuReducer.plugins,
  }
}

export default connect(mapStateToProps)(Reports)
