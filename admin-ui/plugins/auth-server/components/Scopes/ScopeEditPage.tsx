import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import ScopeForm from './ScopeForm'
import { getAttributes, getScripts } from 'Redux/features/initSlice'
import { buildPayload } from 'Utils/PermChecker'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { updateToast } from 'Redux/features/toastSlice'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  useGetOauthScopesByInum,
  usePutOauthScopes,
  getGetOauthScopesQueryKey,
} from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'
import type { ExtendedScope, ScopeScript, ScopeClaim, ModifiedFields, ScopeClient } from './types'
import { EMPTY_SCOPE } from './types'
import { useScopeActions } from './hooks'
import { ScopeWithMessage, DEFAULT_SCOPE_ATTRIBUTES } from './constants'

interface InitState {
  scripts: ScopeScript[]
  attributes: ScopeClaim[]
}

interface RootState {
  initReducer: InitState
}

const ScopeEditPage: React.FC = () => {
  const { t } = useTranslation()

  const { id } = useParams<{ id: string }>()

  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const scripts = useSelector((state: RootState) => state.initReducer.scripts)
  const attributes = useSelector((state: RootState) => state.initReducer.attributes)

  const { logScopeUpdate, navigateToScopeList } = useScopeActions()

  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const inum = useMemo(() => id?.replace(/^:/, '') || '', [id])

  const scopeQueryOptions = useMemo(
    () => ({
      query: {
        enabled: !!inum,
        refetchOnMount: 'always' as const,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: 0,
      },
    }),
    [inum],
  )

  const { data: scopeData, isLoading: scopeLoading } = useGetOauthScopesByInum(
    inum,
    undefined,
    scopeQueryOptions,
  )

  const updateScope = usePutOauthScopes()

  const extensibleScope = useMemo<ExtendedScope>(() => {
    if (scopeData) {
      return {
        ...scopeData,
        clients: scopeData.clients as ScopeClient[] | undefined,
        attributes: scopeData.attributes || DEFAULT_SCOPE_ATTRIBUTES,
      }
    }
    return {
      ...EMPTY_SCOPE,
      inum,
      clients: [],
      attributes: DEFAULT_SCOPE_ATTRIBUTES,
    }
  }, [scopeData, inum])

  const loading = useMemo(
    () => updateScope.isPending || scopeLoading,
    [updateScope.isPending, scopeLoading],
  )

  const handleSearch = useCallback(
    (value: string) => {
      dispatch({
        type: getAttributes.type,
        payload: { options: { pattern: value } },
      })
    },
    [dispatch],
  )

  const handleSubmit = useCallback(
    async (data: string) => {
      if (!data) return

      setErrorMessage(null)

      let parsedData: ScopeWithMessage
      try {
        parsedData = JSON.parse(data) as ScopeWithMessage
      } catch (error) {
        console.error('Error parsing scope data:', error)
        setErrorMessage(t('messages.error_in_parsing_data'))
        return
      }

      try {
        const message = parsedData.action_message || ''
        delete parsedData.action_message

        const response = await updateScope.mutateAsync({ data: parsedData as Scope })

        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0] as string
            return (
              queryKey === getGetOauthScopesQueryKey()[0] || queryKey === 'getOauthScopesByInum'
            )
          },
        })

        const successMessage =
          response?.id || response?.displayName
            ? `Scope '${response.id || response.displayName}' updated successfully`
            : t('messages.scope_updated_successfully')

        dispatch(updateToast(true, 'success', successMessage))
        dispatch(triggerWebhook({ createdFeatureValue: response }))

        try {
          await logScopeUpdate(parsedData as Scope, message, modifiedFields)
        } catch (auditError) {
          console.error('Error logging audit:', auditError)
        }

        navigateToScopeList()
      } catch (error) {
        console.error('Error updating scope:', error)
        setErrorMessage(error instanceof Error ? error.message : t('messages.error_in_saving'))
      }
    },
    [updateScope, logScopeUpdate, modifiedFields, navigateToScopeList, t, queryClient, dispatch],
  )

  useEffect(() => {
    if (attributes.length === 0) {
      const attributeOptions: Record<string, unknown> = {}
      buildPayload(attributeOptions, 'Fetch attributes', {})
      dispatch({
        type: getAttributes.type,
        payload: { options: attributeOptions },
      })
    }
    if (scripts.length === 0) {
      const scriptAction: Record<string, unknown> = {}
      buildPayload(scriptAction, 'Fetch custom scripts', {})
      dispatch({
        type: getScripts.type,
        payload: { action: scriptAction },
      })
    }
  }, [dispatch, attributes.length, scripts.length])

  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity={t('titles.error')}
        message={errorMessage || t('messages.error_in_saving')}
        show={!!errorMessage}
      />
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <ScopeForm
            scope={extensibleScope}
            attributes={attributes}
            scripts={scripts}
            handleSubmit={handleSubmit}
            onSearch={handleSearch}
            modifiedFields={modifiedFields}
            setModifiedFields={setModifiedFields}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ScopeEditPage
