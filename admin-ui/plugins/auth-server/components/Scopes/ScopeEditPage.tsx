import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import ScopeForm from './ScopeForm'
import { getAttributes, getScripts } from 'Redux/features/initSlice'
import { buildPayload } from 'Utils/PermChecker'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useGetOauthScopesByInum, usePutOauthScopes } from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'
import type { ExtendedScope, ScopeScript, ScopeClaim, ModifiedFields, ScopeClient } from './types'
import { EMPTY_SCOPE } from './types'
import { useScopeActions } from './hooks'

interface InitState {
  scripts: ScopeScript[]
  attributes: ScopeClaim[]
}

interface RootState {
  initReducer: InitState
}

const ScopeEditPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>()
  const { logScopeUpdate, navigateToScopeList } = useScopeActions()
  const scripts = useSelector((state: RootState) => state.initReducer.scripts)
  const attributes = useSelector((state: RootState) => state.initReducer.attributes)
  const inum = id?.replace(/^:/, '') || ''

  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: scopeData, isLoading: scopeLoading } = useGetOauthScopesByInum(inum, undefined, {
    query: {
      enabled: !!inum,
    },
  })

  const scope = scopeData

  const updateScope = usePutOauthScopes()

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

  const handleSearch = useCallback(
    (value: string) => {
      dispatch({
        type: getAttributes.type,
        payload: { options: { pattern: value } },
      })
    },
    [dispatch],
  )

  async function handleSubmit(data: string) {
    if (!data) return

    setErrorMessage(null)

    let parsedData: Scope
    try {
      parsedData = JSON.parse(data) as Scope
    } catch (error) {
      console.error('Error parsing scope data:', error)
      setErrorMessage(t('messages.error_in_parsing_data'))
      return
    }

    try {
      const message = (parsedData as Record<string, unknown>).action_message as string
      delete (parsedData as Record<string, unknown>).action_message

      await updateScope.mutateAsync({ data: parsedData })

      try {
        await logScopeUpdate(parsedData, message, modifiedFields)
      } catch (auditError) {
        console.error('Error logging audit:', auditError)
      }

      navigateToScopeList()
    } catch (error) {
      console.error('Error updating scope:', error)
      setErrorMessage(error instanceof Error ? error.message : t('messages.error_in_saving'))
    }
  }

  const extensibleScope: ExtendedScope = scope
    ? {
        ...scope,
        clients: scope.clients as ScopeClient[] | undefined,
        attributes: scope.attributes || {
          spontaneousClientId: undefined,
          spontaneousClientScopes: [],
          showInConfigurationEndpoint: false,
        },
      }
    : {
        ...EMPTY_SCOPE,
        inum,
        clients: [],
        attributes: {
          spontaneousClientId: undefined,
          spontaneousClientScopes: [],
          showInConfigurationEndpoint: false,
        },
      }

  const loading = updateScope.isPending || scopeLoading

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
