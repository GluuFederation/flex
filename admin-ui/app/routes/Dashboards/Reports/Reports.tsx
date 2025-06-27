import React, { useEffect } from 'react'
import { buildPayload } from 'Utils/PermChecker'
import { Container, Row, Col } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { getAttributes, getScripts, getScopes, getClients } from 'Redux/features/initSlice'
import ReportCard from './ReportCard'
import { useTranslation } from 'react-i18next'

// Type definitions
interface Attribute {
  status: 'ACTIVE' | 'INACTIVE'
  [key: string]: any
}

interface Client {
  disabled: boolean
  [key: string]: any
}

interface Scope {
  scopeType: 'oauth' | 'openid'
  [key: string]: any
}

interface Script {
  enabled: boolean
  [key: string]: any
}

interface ReportDataItem {
  name: string
  value: number
}

interface RootState {
  initReducer: {
    attributes: Attribute[]
    clients: Client[]
    scopes: Scope[]
    scripts: Script[]
  }
}

function Reports(): JSX.Element {
  const attributes = useSelector((state: RootState) => state.initReducer.attributes)
  const clients = useSelector((state: RootState) => state.initReducer.clients)
  const scopes = useSelector((state: RootState) => state.initReducer.scopes)
  const scripts = useSelector((state: RootState) => state.initReducer.scripts)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const attributeData: ReportDataItem[] = [
    {
      name: `${t('fields.active')}`,
      value: attributes.filter((item: Attribute) => item.status === 'ACTIVE').length,
    },
    {
      name: `${t('fields.inactive')}`,
      value: attributes.filter((item: Attribute) => item.status === 'INACTIVE').length,
    },
  ]
  const clientData: ReportDataItem[] = [
    {
      name: `${t('fields.enabled')}`,
      value: clients.filter((item: Client) => !item.disabled).length,
    },
    {
      name: `${t('fields.disabled')}`,
      value: clients.filter((item: Client) => item.disabled).length,
    },
  ]
  const scopeData: ReportDataItem[] = [
    {
      name: `${t('fields.oauth')}`,
      value: scopes.filter((item: Scope) => item.scopeType === 'oauth').length,
    },
    {
      name: `${t('fields.openid')}`,
      value: scopes.filter((item: Scope) => item.scopeType === 'openid').length,
    },
  ]
  const scriptData: ReportDataItem[] = [
    {
      name: `${t('fields.enabled')}`,
      value: scripts.filter((item: Script) => item.enabled).length,
    },
    {
      name: `${t('fields.disabled')}`,
      value: scripts.filter((item: Script) => !item.enabled).length,
    },
  ]
  const userAction: Record<string, any> = {}
  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      if (attributes.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch attributes', {})
        dispatch(getAttributes())
      }
      if (clients.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch openid connect clients', {})
        dispatch(getClients())
      }
      if (scopes.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch scopes', {})
        dispatch(getScopes())
      }
      if (scripts.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch custom scripts', {})
        dispatch(getScripts())
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
            upValue={clients.filter((item: Client) => item.disabled).length}
            downValue={clients.filter((item: Client) => !item.disabled).length}
          />
        </Col>
        <Col lg={3}>
          <ReportCard
            data={attributeData}
            title={t('titles.all_attributes')}
            upValue={attributes.filter((item: Attribute) => item.status === 'INACTIVE').length}
            downValue={attributes.filter((item: Attribute) => item.status === 'ACTIVE').length}
          />
        </Col>
        <Col lg={3}>
          <ReportCard
            data={scopeData}
            title={t('titles.all_scopes')}
            upValue={scopes.filter((item: Scope) => item.scopeType === 'openid').length}
            downValue={scopes.filter((item: Scope) => item.scopeType === 'oauth').length}
          />
        </Col>
        <Col lg={3}>
          <ReportCard
            data={scriptData}
            title={t('titles.all_custom_scripts')}
            upValue={scripts.filter((item: Script) => !item.enabled).length}
            downValue={scripts.filter((item: Script) => item.enabled).length}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Reports
