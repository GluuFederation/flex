import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CardBody, Card } from 'Components'
import ScopeForm from './ScopeForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { getAttributes, getScripts } from 'Redux/features/initSlice'
import { buildPayload } from 'Utils/PermChecker'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { usePostOauthScopes } from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'
import type { ExtendedScope, ScopeScript, ScopeClaim, ModifiedFields } from './types'
import { EMPTY_SCOPE } from './types'
import { useScopeActions } from './hooks'

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
  const { logScopeCreation, navigateToScopeList } = useScopeActions()

  const scripts = useSelector((state: RootState) => state.initReducer.scripts)
  const attributes = useSelector((state: RootState) => state.initReducer.attributes)

  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const createScope = usePostOauthScopes()

  useEffect(() => {
    const userAction: Record<string, unknown> = {}
    if (attributes.length === 0) {
      buildPayload(userAction, 'Fetch attributes', { limit: 100 })
      dispatch(getAttributes({ options: userAction }))
    }
    if (scripts.length === 0) {
      buildPayload(userAction, 'Fetch custom scripts', {})
      dispatch(getScripts({ action: userAction }))
    }
  }, [dispatch, attributes.length, scripts.length])

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

      await createScope.mutateAsync({ data: parsedData })

      try {
        await logScopeCreation(parsedData, message, modifiedFields)
      } catch (auditError) {
        console.error('Error logging audit:', auditError)
      }

      navigateToScopeList()
    } catch (error) {
      console.error('Error creating scope:', error)
      setErrorMessage(error instanceof Error ? error.message : t('messages.error_in_saving'))
    }
  }

  const handleSearch = (value: string) => {
    const option = {
      pattern: value,
    }
    dispatch(getAttributes({ options: option }))
  }

  const scope: ExtendedScope = {
    ...EMPTY_SCOPE,
    claims: [],
    dynamicScopeScripts: [],
    defaultScope: false,
    attributes: {
      spontaneousClientId: undefined,
      spontaneousClientScopes: [],
      showInConfigurationEndpoint: false,
    },
  }

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
            scope={scope}
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
