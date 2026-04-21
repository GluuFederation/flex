import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/redux/hooks'
import { GluuPageContent } from '@/components'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { devLogger } from '@/utils/devLogger'
import SetTitle from 'Utils/SetTitle'
import { INITIAL_NEW_CLIENT } from '../constants'
import { useCreateClient, useClientScripts, useOidcProperties } from '../hooks'
import type { ClientModifiedFields, ClientWizardSubmitData } from '../types'

const ClientAddPage = (): JSX.Element => {
  const { t } = useTranslation()
  SetTitle(t('messages.add_client'))

  const { navigateToRoute } = useAppNavigation()

  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const authClientId = useAppSelector((state) => state.authReducer?.config?.clientId)
  const permissions = useAppSelector((state) => state.authReducer.permissions)

  const [modifiedFields, setModifiedFields] = useState<ClientModifiedFields>({})

  const { createClient, isCreating } = useCreateClient({
    userinfo,
    clientId: authClientId,
  })

  const { scripts } = useClientScripts()
  const { oidcConfiguration } = useOidcProperties()

  const handleSubmit = useCallback(
    async (data: ClientWizardSubmitData) => {
      if (!data) return
      try {
        await createClient(data)
        navigateToRoute(ROUTES.AUTH_SERVER_CLIENTS_LIST)
      } catch (error) {
        devLogger.error('Failed to create client:', error instanceof Error ? error : String(error))
      }
    },
    [createClient, navigateToRoute],
  )

  return (
    <GluuLoader blocking={isCreating}>
      <GluuPageContent>
        <ClientWizardForm
          client_data={INITIAL_NEW_CLIENT}
          scripts={scripts}
          permissions={permissions}
          oidcConfiguration={oidcConfiguration}
          customOnSubmit={handleSubmit}
          modifiedFields={modifiedFields}
          setModifiedFields={setModifiedFields}
        />
      </GluuPageContent>
    </GluuLoader>
  )
}

export default ClientAddPage
