import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import {
  useGetAgamaPrj,
  useGetAcrs,
  usePutAcrs,
  getGetAcrsQueryKey,
  type AuthenticationMethod,
} from 'JansConfigApi'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { Button, Form } from 'Components'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import { ThemeContext } from '@/context/theme/themeContext'
import DefaultAcrInput from '../Configuration/DefaultAcrInput'
import { getScripts } from 'Redux/features/initSlice'
import { buildAgamaFlowsArray, buildDropdownOptions, type DropdownOption } from './helper/acrUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { useAcrAudit } from './hooks'

interface CustomScript {
  name: string
  scriptType: string
  enabled: boolean
  [key: string]: unknown
}

interface RootState {
  initReducer: {
    scripts: CustomScript[]
    loadingScripts: boolean
  }
}

interface PutData {
  value: string | string[]
}

const MAX_AGAMA_PROJECTS_FOR_ACR = 500

function DefaultAcr(): React.ReactElement {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { logAcrUpdate } = useAcrAudit()

  const scripts = useSelector((state: RootState) => state.initReducer.scripts)
  const loadingScripts = useSelector((state: RootState) => state.initReducer.loadingScripts)

  // Fetch ACR config using Orval hook
  const {
    data: acrs,
    isLoading: acrLoading,
    error: acrError,
  } = useGetAcrs({
    query: {
      staleTime: 30000,
    },
  })

  // Mutation for updating ACR
  const handleUpdateSuccess = useCallback(() => {
    dispatch(updateToast(true, 'success'))
    queryClient.invalidateQueries({ queryKey: getGetAcrsQueryKey() })
  }, [dispatch, queryClient])

  const handleUpdateError = useCallback(
    (error: Error) => {
      const errorMessage = error?.message || 'Failed to update default ACR'
      dispatch(updateToast(true, 'error', errorMessage))
    },
    [dispatch],
  )

  const putAcrsMutation = usePutAcrs({
    mutation: {
      onSuccess: handleUpdateSuccess,
      onError: handleUpdateError,
    },
  })

  // Fetch Agama projects using React Query
  const {
    data: projectsResponse,
    isLoading: agamaLoading,
    error,
  } = useGetAgamaPrj({
    count: MAX_AGAMA_PROJECTS_FOR_ACR,
    start: 0,
  })

  const { t } = useTranslation()

  const [modal, setModal] = useState<boolean>(false)
  const [put, setPut] = useState<PutData | null>(null)
  SetTitle(t('titles.authentication'))

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'

  const authResourceId = ADMIN_UI_RESOURCES.Authentication
  const authScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[authResourceId] || [], [authResourceId])

  const canReadAuth = useMemo(
    () => hasCedarReadPermission(authResourceId),
    [hasCedarReadPermission, authResourceId],
  )
  const canWriteAuth = useMemo(
    () => hasCedarWritePermission(authResourceId),
    [hasCedarWritePermission, authResourceId],
  )

  useEffect(() => {
    if (authScopes && authScopes.length > 0) {
      authorizeHelper(authScopes)
    }
  }, [authorizeHelper, authScopes])

  useEffect(() => {
    dispatch(getScripts({ action: { action_data: {} } }))
  }, [dispatch])

  // Surface ACR fetch failures
  useEffect(() => {
    if (acrError) {
      const errorMessage = (acrError as Error)?.message || 'Failed to fetch ACR configuration'
      dispatch(updateToast(true, 'error', errorMessage))
    }
  }, [acrError, dispatch])

  // Surface Agama fetch failures
  useEffect(() => {
    if (error) {
      const errorMessage =
        (error as Error)?.message ||
        'Failed to fetch Agama projects. Only showing authentication scripts.'
      dispatch(updateToast(true, 'error', errorMessage))
    }
  }, [error, dispatch])

  const authScripts = useMemo<DropdownOption[]>(() => {
    const filteredScripts = (scripts || [])
      .filter((item) => item?.scriptType === 'person_authentication' && item?.enabled)
      .map((item) => ({ key: item.name, value: item.name }))
    const agamaList = projectsResponse?.entries || []
    const agamaFlows = buildAgamaFlowsArray(agamaList)
    const dropdownOptions = buildDropdownOptions(filteredScripts, agamaFlows)

    return dropdownOptions
  }, [scripts, projectsResponse])

  const toggle = (): void => {
    setModal(!modal)
  }

  const putHandler = (putData: PutData): void => {
    setPut(putData)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setModal(true)
  }

  const handleSaveClick = (): void => {
    setModal(true)
  }

  const submitForm = async (userMessage: string): Promise<void> => {
    toggle()

    if (put?.value) {
      const acrValue = Array.isArray(put.value) ? put.value[0] : put.value
      const newAcr: AuthenticationMethod = { defaultAcr: acrValue }
      try {
        await putAcrsMutation.mutateAsync({ data: newAcr })
        try {
          await logAcrUpdate(newAcr, userMessage, { defaultAcr: acrValue })
        } catch (auditError) {
          console.error('Failed to log ACR update:', auditError)
          dispatch(
            updateToast(
              true,
              'warning',
              t('messages.audit_log_failed', 'Update succeeded, but audit logging failed'),
            ),
          )
        }
      } catch {
        // Mutation error handling is done in onError callback
      }
    }
  }

  return (
    <GluuLoader
      blocking={loadingScripts || agamaLoading || acrLoading || putAcrsMutation.isPending}
    >
      <Form onSubmit={handleSubmit}>
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
        <div style={{ padding: '3vh' }}>
          <GluuViewWrapper canShow={canReadAuth}>
            <DefaultAcrInput
              name="defaultAcr"
              lsize={6}
              rsize={6}
              label={t('fields.default_acr')}
              handler={putHandler}
              value={acrs?.defaultAcr}
              options={authScripts}
              path="/ACR"
              isArray={false}
              showSaveButtons={false}
            />
          </GluuViewWrapper>
          {canWriteAuth && (
            <Button
              color={`primary-${selectedTheme}`}
              onClick={handleSaveClick}
              disabled={
                !put?.value ||
                (Array.isArray(put.value) ? put.value[0] : put.value) === acrs?.defaultAcr
              }
            >
              <i className="fa fa-check-circle me-2"></i>
              {t('actions.save')}
            </Button>
          )}
        </div>
      </Form>
    </GluuLoader>
  )
}

export default DefaultAcr
