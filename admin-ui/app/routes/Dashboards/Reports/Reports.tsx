import React, { useMemo } from 'react'
import { Container, Row, Col } from 'Components'
import {
  useGetAttributes,
  useGetOauthOpenidClients,
  useGetOauthScopes,
  useGetConfigScripts,
  type JansAttribute,
  type Client,
  type Scope,
  type CustomScript,
} from 'JansConfigApi'
import { useSelector } from 'react-redux'
import ReportCard from './ReportCard'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import type { RootState } from 'Redux/sagas/types/audit'
import type { ReportCardData } from '../types'
import { REPORTS_CACHE_CONFIG } from '../constants'

function Reports() {
  const { t } = useTranslation()
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  const queryOptions = useMemo(
    () => ({
      query: {
        enabled: !!authToken,
        staleTime: REPORTS_CACHE_CONFIG.STALE_TIME,
        gcTime: REPORTS_CACHE_CONFIG.GC_TIME,
      },
    }),
    [authToken],
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

  const attributes = (attributesData?.entries ?? []) as unknown as JansAttribute[]
  const clients = (clientsData?.entries ?? []) as unknown as Client[]
  const scopes = (scopesData?.entries ?? []) as unknown as Scope[]
  const scripts = (scriptsData?.entries ?? []) as unknown as CustomScript[]

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
              upValue={clients.filter((item) => item.disabled).length}
              downValue={clients.filter((item) => !item.disabled).length}
            />
          </Col>
          <Col lg={3}>
            <ReportCard
              data={attributeData}
              title={t('titles.all_attributes')}
              upValue={attributes.filter((item) => item.status === 'inactive').length}
              downValue={attributes.filter((item) => item.status === 'active').length}
            />
          </Col>
          <Col lg={3}>
            <ReportCard
              data={scopeData}
              title={t('titles.all_scopes')}
              upValue={scopes.filter((item) => item.scopeType === 'openid').length}
              downValue={scopes.filter((item) => item.scopeType === 'oauth').length}
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
    </GluuLoader>
  )
}

export default Reports
