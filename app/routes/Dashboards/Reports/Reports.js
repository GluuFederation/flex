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
  getScripts,
  getScopes,
  getClients,
} from '../../../redux/actions/InitActions'
import ReportPiChartItem from './ReportPiChartItem'
import { useTranslation } from 'react-i18next'

function Reports({ attributes, clients, scopes, scripts, dispatch }) {
  const { t } = useTranslation()

  const attributeData = [
    {
      name: 'Active',
      value: attributes.filter((item) => item.status === 'ACTIVE').length,
    },
    {
      name: 'InActive',
      value: attributes.filter((item) => item.status === 'INACTIVE').length,
    },
  ]
  const clientData = [
    {
      name: 'Enabled',
      value: clients.filter((item) => !item.disabled).length,
    },
    {
      name: 'Disabled',
      value: clients.filter((item) => item.disabled).length,
    },
  ]
  const scopeData = [
    {
      name: 'OAuth',
      value: scopes.filter((item) => item.scopeType === 'oauth').length,
    },
    {
      name: 'OpenID',
      value: scopes.filter((item) => item.scopeType === 'openid').length,
    },
  ]
  const scriptData = [
    {
      name: 'Enabled',
      value: scripts.filter((item) => item.enabled).length,
    },
    {
      name: 'Disabled',
      value: scripts.filter((item) => !item.enabled).length,
    },
  ]
  const userAction = {}
  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      if (attributes.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch attributes', {})
        dispatch(getAttributes(userAction))
      }
      if (clients.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch openid connect clients', {})
        dispatch(getClients(userAction))
      }
      if (scopes.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch scopes', {})
        dispatch(getScopes(userAction))
      }
      if (scripts.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch custom scripts', {})
        dispatch(getScripts(userAction))
      }
      count++
    }, 1000)
    return () => clearInterval(interval)
  }, [1000])

  return (
    <Container>
      <Row>
        <Col lg={3}>
          <Card className="mb-3">
            <CardBody>
              <CardTitle tag="h6" className="mb-4">
                {t('All OIDC Clients')}
              </CardTitle>
              <ReportPiChartItem data={clientData} />
              <div>
                <div className="mb-3">
                  <h2>{clients.filter((item) => item.disabled).length}</h2>
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
              <ReportPiChartItem data={attributeData} />
              <div>
                <div className="mb-3">
                  <h2>
                    {
                      attributes.filter((item) => item.status === 'INACTIVE')
                        .length
                    }
                  </h2>
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
              <ReportPiChartItem data={scopeData} />
              <div>
                <div className="mb-3">
                  <h2>
                    {
                      scopes.filter((item) => item.scopeType === 'openid')
                        .length
                    }
                  </h2>
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
              <ReportPiChartItem data={scriptData} />
              <div>
                <div className="mb-3">
                  <h2>{scripts.filter((item) => !item.enabled).length}</h2>
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
    attributes: state.initReducer.attributes,
    clients: state.initReducer.clients,
    scopes: state.initReducer.scopes,
    scripts: state.initReducer.scripts,
  }
}

export default connect(mapStateToProps)(Reports)
