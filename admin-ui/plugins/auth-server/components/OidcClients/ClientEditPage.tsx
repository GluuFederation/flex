import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'
import { useGetOauthOpenidClientsByInum } from 'JansConfigApi'
import { useAppSelector } from '@/redux/hooks'
import { GluuPageContent } from '@/components'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { devLogger } from '@/utils/devLogger'
import SetTitle from 'Utils/SetTitle'
import { useUpdateClient, useClientScripts, useOidcProperties } from './hooks'
import { CLIENT_VIEW_QUERY_PARAM, CLIENT_VIEW_QUERY_VALUE } from './constants'
import type { JsonValue } from '@/routes/Apps/Gluu/types/common'
import type { ClientModifiedFields, ClientWizardSubmitData } from './types'

const ClientEditPage = (): JSX.Element => {
  const { t } = useTranslation()
  SetTitle(t('messages.edit_client'))

  const { navigateBack } = useAppNavigation()
  const { id: routeInum } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const viewOnly = searchParams.get(CLIENT_VIEW_QUERY_PARAM) === CLIENT_VIEW_QUERY_VALUE

  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const authClientId = useAppSelector((state) => state.authReducer?.config?.clientId)
  const permissions = useAppSelector((state) => state.authReducer.permissions)

  const [modifiedFields, setModifiedFields] = useState<ClientModifiedFields>({})

  const { data: clientData, isLoading: isClientLoading } = useGetOauthOpenidClientsByInum(
    routeInum ?? '',
    { query: { enabled: !!routeInum } },
  )

  const { scripts, isLoading: isScriptsLoading } = useClientScripts()
  const { oidcConfiguration, isLoading: isOidcLoading } = useOidcProperties()

  const { updateClient, isUpdating } = useUpdateClient({
    userinfo,
    clientId: authClientId,
  })

  const formClientData = useMemo(
    () => ({
      ...(clientData ?? {}),
      attributes: (clientData?.attributes ?? {}) as Record<string, JsonValue>,
    }),
    [clientData],
  )

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

  const blocking = isUpdating || isOidcLoading || isClientLoading || isScriptsLoading
  const isReady = !isOidcLoading && !isClientLoading && !!clientData

  return (
    <GluuLoader blocking={blocking}>
      <GluuPageContent>
        {isReady && (
          <ClientWizardForm
            client_data={formClientData}
            viewOnly={viewOnly}
            scripts={scripts}
            permissions={permissions}
            oidcConfiguration={oidcConfiguration}
            customOnSubmit={handleSubmit}
            isEdit={true}
            modifiedFields={modifiedFields}
            setModifiedFields={setModifiedFields}
          />
        )}
      </GluuPageContent>
    </GluuLoader>
  )
}

export default ClientEditPage
