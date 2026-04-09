import { useEffect, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { getOidcDiscovery } from 'Redux/features/oidcDiscoverySlice'
import { emptyScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import { getScripts } from 'Redux/features/initSlice'
import { devLogger } from '@/utils/devLogger'
import SetTitle from 'Utils/SetTitle'
import { INITIAL_NEW_CLIENT } from './constants'
import { useCreateClient } from './hooks'
import type { ClientModifiedFields, ClientWizardSubmitData } from './types'

const ClientAddPage = (): JSX.Element => {
  const { t } = useTranslation()
  SetTitle(t('messages.add_client'))

  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()

  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const authClientId = useAppSelector((state) => state.authReducer?.config?.clientId)
  const permissions = useAppSelector((state) => state.authReducer.permissions)
  const scopeItems = useAppSelector((state) => state.scopeReducer?.items ?? [])
  const scripts = useAppSelector((state) => state.initReducer.scripts)
  const oidcConfiguration = useAppSelector((state) => state.oidcDiscoveryReducer.configuration)

  const [modifiedFields, setModifiedFields] = useState<ClientModifiedFields>({})

  const { createClient, isCreating } = useCreateClient({
    userinfo,
    clientId: authClientId,
  })

  const scopes = useMemo(
    () => scopeItems.map((item) => ({ dn: item.dn, name: item.id })),
    [scopeItems],
  )

  useEffect(() => {
    dispatch(emptyScopes())
    if (scripts.length < 1) {
      dispatch(getScripts({}))
    }
    dispatch(getOidcDiscovery())
  }, [dispatch, scripts.length])

  const handleSubmit = useCallback(
    async (data: ClientWizardSubmitData) => {
      if (!data) return
      try {
        await createClient(data)
        navigateToRoute(ROUTES.AUTH_SERVER_CLIENTS_LIST)
      } catch (error) {
        devLogger.error('Failed to create client:', error)
      }
    },
    [createClient, navigateToRoute],
  )

  return (
    <GluuLoader blocking={isCreating}>
      <ClientWizardForm
        client_data={INITIAL_NEW_CLIENT}
        scopes={scopes}
        scripts={scripts}
        permissions={permissions}
        oidcConfiguration={oidcConfiguration}
        customOnSubmit={handleSubmit}
        modifiedFields={modifiedFields}
        setModifiedFields={setModifiedFields}
      />
    </GluuLoader>
  )
}

export default ClientAddPage
