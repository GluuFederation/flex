import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { CardBody, Card } from 'Components'
import ScopeForm from './ScopeForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { getAttributes, getScripts } from 'Redux/features/initSlice'
import { buildPayload } from 'Utils/PermChecker'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { updateToast } from 'Redux/features/toastSlice'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { usePostOauthScopes, getGetOauthScopesQueryKey } from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'
import type { ScopeScript, ScopeClaim, ModifiedFields } from './types'
import { useScopeActions } from './hooks'
import { ScopeWithMessage, INITIAL_SCOPE } from './constants'

interface InitState {
  scripts: ScopeScript[]
  attributes: ScopeClaim[]
}

interface RootState {
  initReducer: InitState
}

const ScopeAddPage: React.FC = () => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const scripts = useSelector((state: RootState) => state.initReducer.scripts)
  const attributes = useSelector((state: RootState) => state.initReducer.attributes)

  const { logScopeCreation, navigateToScopeList } = useScopeActions()

  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const createScope = usePostOauthScopes()

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

        const response = await createScope.mutateAsync({ data: parsedData as Scope })

        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0] as string
            return (
              queryKey === getGetOauthScopesQueryKey()[0] || queryKey === 'getOauthScopesByInum'
            )
          },
        })

        const successMessage =
          response?.displayName || response?.id
            ? `Scope '${response.displayName || response.id}' created successfully`
            : t('messages.scope_created_successfully')

        dispatch(updateToast(true, 'success', successMessage))

        try {
          await logScopeCreation(parsedData as Scope, message, modifiedFields)
        } catch (auditError) {
          console.error('Error logging audit:', auditError)
        }

        navigateToScopeList()
      } catch (error) {
        console.error('Error creating scope:', error)
        setErrorMessage(error instanceof Error ? error.message : t('messages.error_in_saving'))
      }
    },
    [createScope, logScopeCreation, modifiedFields, navigateToScopeList, t, queryClient, dispatch],
  )

  useEffect(() => {
    if (attributes.length === 0) {
      const attributeOptions: Record<string, unknown> = {}
      buildPayload(attributeOptions, 'Fetch attributes', { limit: 100 })
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

  const handleSearch = useCallback(
    (value: string) => {
      dispatch({
        type: getAttributes.type,
        payload: { options: { pattern: value } },
      })
    },
    [dispatch],
  )

  return (
    <GluuLoader blocking={createScope.isPending}>
      <GluuAlert
        severity={t('titles.error')}
        message={errorMessage || t('messages.error_in_saving')}
        show={!!errorMessage}
      />
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <ScopeForm
            scope={INITIAL_SCOPE}
            scripts={scripts}
            attributes={attributes}
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

export default ScopeAddPage
