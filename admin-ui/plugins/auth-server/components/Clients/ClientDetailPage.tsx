import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import SetTitle from 'Utils/SetTitle'
import { useGetOauthScopes } from 'JansConfigApi'
import { useClientActions, useClientById } from './hooks'
import ClientForm from './components/ClientForm'
import { transformScopesResponse } from './helper/utils'

const ClientDetailPage: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { navigateToClientList } = useClientActions()

  const { data: client, isLoading: clientLoading } = useClientById(id || '', Boolean(id))

  const { data: scopesResponse, isLoading: scopesLoading } = useGetOauthScopes(
    { limit: 200 },
    { query: { staleTime: 60000 } },
  )

  const scopes = useMemo(
    () => transformScopesResponse(scopesResponse?.entries),
    [scopesResponse?.entries],
  )

  const isLoading = clientLoading || scopesLoading

  SetTitle(t('titles.client_detail'))

  if (!id) {
    return null
  }

  return (
    <GluuLoader blocking={isLoading}>
      {client && (
        <ClientForm
          client={client}
          isEdit={true}
          viewOnly={true}
          onCancel={navigateToClientList}
          scopes={scopes}
          scopesLoading={scopesLoading}
          onSubmit={() => {}}
        />
      )}
    </GluuLoader>
  )
}

export default ClientDetailPage
