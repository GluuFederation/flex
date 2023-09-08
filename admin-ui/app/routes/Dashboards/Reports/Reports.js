import React, { useEffect } from 'react'
import { buildPayload } from 'Utils/PermChecker'
import { Container, Row, Col } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAttributes,
  getScripts,
  getScopes,
  getClients,
} from 'Redux/features/initSlice'
import ReportCard from './ReportCard'
import { useTranslation } from 'react-i18next'

function Reports() {
  const attributes = useSelector(state => state.initReducer.attributes);
  const clients = useSelector(state => state.initReducer.clients);
  const scopes = useSelector(state => state.initReducer.scopes);
  const scripts = useSelector(state => state.initReducer.scripts);
  const dispatch = useDispatch()
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
        dispatch(getAttributes({ options: userAction }))
      }
      if (clients.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch openid connect clients', {})
        dispatch(getClients({ action: userAction }))
      }
      if (scopes.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch scopes', {})
        dispatch(getScopes({ action: userAction }))
      }
      if (scripts.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch custom scripts', {})
        dispatch(getScripts({ action: userAction }))
      }
      count++
    }, 1000)
    return () => clearInterval(interval)
  }, [1000])

  return (
    <Container>
      <Row>
        <Col lg={3}>
          <ReportCard
            data={clientData}
            title={t('titles.all_oidc_clients')}
            upValue={clients.filter((item) => item.disabled).length}
            downValue={clients.filter((item) => !item.disabled).length}
          />
        </Col>
        <Col lg={3}>
          <ReportCard
            data={attributeData}
            title={t('titles.all_attributes')}
            upValue={
              attributes.filter((item) => item.status === 'INACTIVE').length
            }
            downValue={
              attributes.filter((item) => item.status === 'ACTIVE').length
            }
          />
        </Col>
        <Col lg={3}>
          <ReportCard
            data={scopeData}
            title={t('titles.all_scopes')}
            upValue={
              scopes.filter((item) => item.scopeType === 'openid').length
            }
            downValue={
              scopes.filter((item) => item.scopeType === 'oauth').length
            }
          />
        </Col>
        <Col lg={3}>
          <ReportCard
            data={scriptData}
            title={t('titles.all_custom_scripts')}
            upValue={scripts.filter((item) => !item.enabled).length}
            downValue={scripts.filter((item) => item.enabled).length}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Reports
