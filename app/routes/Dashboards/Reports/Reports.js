import React, { useEffect } from 'react'
import {
  buildPayload,
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
      name: `${t('fields.active')}`,
      value: attributes.filter((item) => item.status === 'ACTIVE').length,
    },
    {
      name: `${t('fields.inactive')}`,
      value: attributes.filter((item) => item.status === 'INACTIVE').length,
    },
  ]
  const clientData = [
    {
      name: `${t('fields.enabled')}`,
      value: clients.filter((item) => !item.disabled).length,
    },
    {
      name: `${t('fields.disabled')}`,
      value: clients.filter((item) => item.disabled).length,
    },
  ]
  const scopeData = [
    {
      name: `${t('fields.oauth')}`,
      value: scopes.filter((item) => item.scopeType === 'oauth').length,
    },
    {
      name: `${t('fields.openid')}`,
      value: scopes.filter((item) => item.scopeType === 'openid').length,
    },
  ]
  const scriptData = [
    {
      name: `${t('fields.enabled')}`,
      value: scripts.filter((item) => item.enabled).length,
    },
    {
      name: `${t('fields.disabled')}`,
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
                {t('titles.all_oidc_clients')}
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
                {t('titles.all_attributes')}
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
                {t('titles.all_scopes')}
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
                {t('titles.all_custom_scripts')}
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
