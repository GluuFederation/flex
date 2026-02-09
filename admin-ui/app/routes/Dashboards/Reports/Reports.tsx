import React, { useMemo } from 'react'
import { Container, Row, Col } from 'Components'
import {
  useGetAttributes,
  useGetOauthOpenidClients,
  useGetOauthScopes,
  useGetConfigScripts,
  type Client,
  type Scope,
  type CustomScript,
  type PagedResultEntriesItem,
} from 'JansConfigApi'
import { useAppSelector } from '@/redux/hooks'
import ReportCard from './ReportCard'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import type { ReportCardData } from '../types'
import { REPORTS_CACHE_CONFIG } from '../constants'

type AttributeReportItem = PagedResultEntriesItem & { name: string; status?: string }

function isAttributeReportItem(entry: PagedResultEntriesItem): entry is AttributeReportItem {
  return (
    entry !== null &&
    typeof entry === 'object' &&
    'name' in entry &&
    typeof entry['name'] === 'string'
  )
}

function Reports() {
  const { t } = useTranslation()
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  const queryOptions = useMemo(
    () => ({
      query: {
        enabled: hasSession === true,
        staleTime: REPORTS_CACHE_CONFIG.STALE_TIME,
        gcTime: REPORTS_CACHE_CONFIG.GC_TIME,
      },
    }),
    [hasSession],
  )

  const { data: attributesData, isLoading: loadingAttributes } = useGetAttributes(
    undefined,
    queryOptions,
  )
  const { data: clientsData, isLoading: loadingClients } = useGetOauthOpenidClients(
    undefined,
    queryOptions,
  )
  const { data: scopesData, isLoading: loadingScopes } = useGetOauthScopes(undefined, queryOptions)
  const { data: scriptsData, isLoading: loadingScripts } = useGetConfigScripts(
    undefined,
    queryOptions,
  )

  const attributes = (attributesData?.entries ?? []).filter(isAttributeReportItem)
  const clients = (clientsData?.entries as Client[]) ?? []
  const scopes = (scopesData?.entries as Scope[]) ?? []
  const scripts = (scriptsData?.entries as CustomScript[]) ?? []

  const isLoading = loadingAttributes || loadingClients || loadingScopes || loadingScripts

  const attributeData: ReportCardData[] = useMemo(
    () => [
      {
        name: t('fields.active'),
        value: attributes.filter((item) => item.status === 'active').length,
      },
      {
        name: t('fields.inactive'),
        value: attributes.filter((item) => item.status === 'inactive').length,
      },
    ],
    [attributes, t],
  )

  const clientData: ReportCardData[] = useMemo(
    () => [
      {
        name: t('fields.enabled'),
        value: clients.filter((item) => !item.disabled).length,
      },
      {
        name: t('fields.disabled'),
        value: clients.filter((item) => item.disabled).length,
      },
    ],
    [clients, t],
  )

  const scopeData: ReportCardData[] = useMemo(
    () => [
      {
        name: t('fields.oauth'),
        value: scopes.filter((item) => item.scopeType === 'oauth').length,
      },
      {
        name: t('fields.openid'),
        value: scopes.filter((item) => item.scopeType === 'openid').length,
      },
    ],
    [scopes, t],
  )

  const scriptData: ReportCardData[] = useMemo(
    () => [
      {
        name: t('fields.enabled'),
        value: scripts.filter((item) => item.enabled).length,
      },
      {
        name: t('fields.disabled'),
        value: scripts.filter((item) => !item.enabled).length,
      },
    ],
    [scripts, t],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <Container>
        <Row>
          <Col lg={3}>
            <ReportCard
              data={clientData}
              title={t('titles.all_oidc_clients')}
              upValue={clientData[1].value}
              downValue={clientData[0].value}
            />
          </Col>
          <Col lg={3}>
            <ReportCard
              data={attributeData}
              title={t('titles.all_attributes')}
              upValue={attributeData[1].value}
              downValue={attributeData[0].value}
            />
          </Col>
          <Col lg={3}>
            <ReportCard
              data={scopeData}
              title={t('titles.all_scopes')}
              upValue={scopeData[1].value}
              downValue={scopeData[0].value}
            />
          </Col>
          <Col lg={3}>
            <ReportCard
              data={scriptData}
              title={t('titles.all_custom_scripts')}
              upValue={scriptData[1].value}
              downValue={scriptData[0].value}
            />
          </Col>
        </Row>
      </Container>
    </GluuLoader>
  )
}

export default Reports
