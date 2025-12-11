import React, { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import SetTitle from 'Utils/SetTitle'
import { updateToast } from 'Redux/features/toastSlice'
import { useGetOauthScopes } from 'JansConfigApi'
import { useClientActions, useClientById, useUpdateClient } from './hooks'
import ClientForm from './components/ClientForm'
import type { ClientFormValues, ModifiedFields } from './types'
import { transformScopesResponse } from './helper/utils'

const ClientEditPage: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
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

  const scopes = useMemo(
    () => transformScopesResponse(scopesResponse?.entries),
    [scopesResponse?.entries],
  )

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
          try {
            await logClientUpdate(result, message, modifiedFields)
          } catch (auditError) {
            console.error('Error logging client update:', auditError)
            dispatch(updateToast(true, 'warning', t('messages.audit_log_failed')))
          }
        }
      } catch (error) {
        console.error('Error updating client:', error)
      }
    },
    [updateClient, logClientUpdate, dispatch, t],
  )

  const isLoading = clientLoading || updateClient.isPending

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
