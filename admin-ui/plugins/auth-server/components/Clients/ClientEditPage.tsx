import { useEffect, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { useGetOauthOpenidClientsByInum } from 'JansConfigApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { getScopeByCreator, emptyScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import { getOidcDiscovery } from 'Redux/features/oidcDiscoverySlice'
import { getUMAResourcesByClient } from 'Plugins/auth-server/redux/features/umaResourceSlice'
import { getScripts } from 'Redux/features/initSlice'
import { devLogger } from '@/utils/devLogger'
import SetTitle from 'Utils/SetTitle'
import { useUpdateClient } from './hooks'
import { CLIENT_VIEW_QUERY_PARAM, CLIENT_VIEW_QUERY_VALUE } from './constants'
import type { ClientModifiedFields, ClientWizardSubmitData } from './types'

const ClientEditPage = (): JSX.Element => {
  const { t } = useTranslation()
  SetTitle(t('messages.edit_client'))

  const dispatch = useAppDispatch()
  const { navigateBack } = useAppNavigation()
  const { id: routeInum } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const viewOnly = searchParams.get(CLIENT_VIEW_QUERY_PARAM) === CLIENT_VIEW_QUERY_VALUE

  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const authClientId = useAppSelector((state) => state.authReducer?.config?.clientId)
  const scopeItems = useAppSelector((state) => state.scopeReducer?.items ?? [])
  const scripts = useAppSelector((state) => state.initReducer.scripts)
  const permissions = useAppSelector((state) => state.authReducer.permissions)
  const oidcConfiguration = useAppSelector((state) => state.oidcDiscoveryReducer.configuration)
  const umaResources = useAppSelector((state) => state.umaResourceReducer?.items ?? [])
  const loadingOidcDiscovery = useAppSelector((state) => state.oidcDiscoveryReducer.loading)

  const [modifiedFields, setModifiedFields] = useState<ClientModifiedFields>({})

  const { data: clientData, isLoading: isClientLoading } = useGetOauthOpenidClientsByInum(
    routeInum ?? '',
    { query: { enabled: !!routeInum } },
  )

  const { updateClient, isUpdating } = useUpdateClient({
    userinfo,
    clientId: authClientId,
  })

  const clientInum = clientData?.inum

  useEffect(() => {
    dispatch(emptyScopes())
    if (clientInum) {
      dispatch(getScopeByCreator({ action: { inum: clientInum } }))
    }
    if (scripts.length < 1) {
      dispatch(getScripts({}))
    }
    if (isEmpty(umaResources) && clientInum) {
      dispatch(getUMAResourcesByClient({ inum: clientInum }))
    }
    dispatch(getOidcDiscovery())
  }, [dispatch, clientInum, scripts.length, umaResources])

  const formClientData = useMemo(
    () => ({
      ...(clientData ?? {}),
      attributes: clientData?.attributes ?? {},
    }),
    [clientData],
  )

  const scopes = useMemo(() => scopeItems.map((item) => ({ ...item, name: item.id })), [scopeItems])

  const handleSubmit = useCallback(
    async (data: ClientWizardSubmitData) => {
      if (!data) return
      try {
        await updateClient(data)
        navigateBack(ROUTES.AUTH_SERVER_CLIENTS_LIST)
      } catch (error) {
        devLogger.error('Failed to update client:', error)
      }
    },
    [updateClient, navigateBack],
  )

  const blocking = isUpdating || loadingOidcDiscovery || isClientLoading
  const isReady = !loadingOidcDiscovery && !!clientData

  return (
    <GluuLoader blocking={blocking}>
      {isReady && (
        <ClientWizardForm
          client_data={formClientData}
          viewOnly={viewOnly}
          scopes={scopes}
          scripts={scripts}
          permissions={permissions}
          oidcConfiguration={oidcConfiguration}
          customOnSubmit={handleSubmit}
          umaResources={umaResources}
          isEdit={true}
          modifiedFields={modifiedFields}
          setModifiedFields={setModifiedFields}
        />
      )}
    </GluuLoader>
  )
}

export default ClientEditPage
