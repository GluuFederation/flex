import React, { useEffect } from 'react'
import {
  hasPermission,
  buildPayload,
  CLIENT_WRITE,
  CLIENT_READ,
  CLIENT_DELETE,
} from '../../../../app/utils/PermChecker'
import {
  Container,
  Row,
  Card,
  CardBody,
  CardTitle,
  Col,
} from './../../../components'
import { connect } from 'react-redux'
import {
  getAttributes,
  getCustomScripts,
  getScopes,
  getOpenidClients,
} from '../../../redux/actions/ReportsActions'
import { useTranslation } from 'react-i18next'

function Reports({ attributes, clients, scopes, scripts, dispatch }) {
  const { t } = useTranslation()
  const userAction = {}
  useEffect(() => {
    if (attributes.length === 0) {
      buildPayload(userAction, 'Fetch attributes', {})
      dispatch(getAttributes(userAction))
    }
    if (clients.length === 0) {
      buildPayload(userAction, 'Fetch openid connect clients', {})
      dispatch(getOpenidClients(userAction))
    }
    if (scopes.length === 0) {
      buildPayload(userAction, 'Fetch scopes', {})
      dispatch(getScopes(userAction))
    }
    if (scripts.length === 0) {
      buildPayload(userAction, 'Fetch custom scripts', {})
      dispatch(getCustomScripts(userAction))
    }
  }, [])

  return (
    <Container>
      <Row>
        <Col lg={3}>
          <Card className="mb-3">
            <CardBody>
              <CardTitle tag="h6" className="mb-4">
                {t('All OIDC Clients')}
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
                {t('All Attributes')}
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
                {t('All Scopes')}
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
                {t('All Custom Scripts')}
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
  }
}

export default connect(mapStateToProps)(Reports)
