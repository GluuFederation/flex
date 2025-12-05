import React, { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import SetTitle from 'Utils/SetTitle'
import { useGetOauthScopes } from 'JansConfigApi'
import { useClientActions, useClientById, useUpdateClient } from './hooks'
import ClientForm from './components/ClientForm'
import type { ClientFormValues, ModifiedFields, ClientScope } from './types'

const ClientEditPage: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { logClientUpdate, navigateToClientList } = useClientActions()
  const [scopeSearchPattern, setScopeSearchPattern] = useState('')

  const { data: client, isLoading: clientLoading } = useClientById(id || '', Boolean(id))

  const scopeQueryParams = useMemo(
    () => ({
      limit: 200,
      pattern: scopeSearchPattern || undefined,
    }),
    [scopeSearchPattern],
  )

  const { data: scopesResponse, isLoading: scopesLoading } = useGetOauthScopes(scopeQueryParams, {
    query: {
      refetchOnMount: 'always' as const,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  })

  const scopes = useMemo((): ClientScope[] => {
    const entries = (scopesResponse?.entries || []) as Array<{
      dn?: string
      inum?: string
      id?: string
      displayName?: string
      description?: string
    }>
    return entries.map(
      (scope): ClientScope => ({
        dn: scope.dn || '',
        inum: scope.inum,
        id: scope.id,
        displayName: scope.displayName || scope.id,
        description: scope.description,
      }),
    )
  }, [scopesResponse?.entries])

  const handleScopeSearch = useCallback((pattern: string) => {
    setScopeSearchPattern(pattern)
  }, [])

  const handleSuccess = useCallback(() => {
    navigateToClientList()
  }, [navigateToClientList])

  const updateClient = useUpdateClient(handleSuccess)

  const handleSubmit = useCallback(
    async (values: ClientFormValues, message: string, modifiedFields: ModifiedFields) => {
      try {
        const result = await updateClient.mutateAsync({ data: values })
        if (result) {
          await logClientUpdate(result, message, modifiedFields)
        }
      } catch (error) {
        console.error('Error updating client:', error)
      }
    },
    [updateClient, logClientUpdate],
  )

  const isLoading = useMemo(
    () => clientLoading || updateClient.isPending,
    [clientLoading, updateClient.isPending],
  )

  SetTitle(t('titles.edit_openid_connect_client'))

  if (!id) {
    return null
  }

  return (
    <GluuLoader blocking={isLoading}>
      {client && (
        <ClientForm
          client={client}
          isEdit={true}
          viewOnly={false}
          onSubmit={handleSubmit}
          onCancel={navigateToClientList}
          scopes={scopes}
          scopesLoading={scopesLoading}
          onScopeSearch={handleScopeSearch}
        />
      )}
    </GluuLoader>
  )
}

export default ClientEditPage
