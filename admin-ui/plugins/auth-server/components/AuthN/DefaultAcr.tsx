import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { getAcrsConfig, editAcrs } from 'Plugins/auth-server/redux/features/acrSlice'
import { useGetAgamaPrj } from 'JansConfigApi'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { buildPayload } from 'Utils/PermChecker'
import { Button, Form } from 'Components'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import { ThemeContext } from '@/context/theme/themeContext'
import DefaultAcrInput from '../Configuration/DefaultAcrInput'
import { getScripts } from 'Redux/features/initSlice'
import { buildAgamaFlowsArray, buildDropdownOptions, type DropdownOption } from './helper/acrUtils'
import { updateToast } from 'Redux/features/toastSlice'

interface CustomScript {
  name: string
  scriptType: string
  enabled: boolean
  [key: string]: unknown
}

interface RootState {
  acrReducer: {
    acrReponse?: {
      defaultAcr?: string
    }
    loading: boolean
    error: string | null
  }
  initReducer: {
    scripts: CustomScript[]
    loadingScripts: boolean
  }
}

interface PutData {
  value: string
  path?: string
  op?: string
}

const MAX_AGAMA_PROJECTS_FOR_ACR = 500

function DefaultAcr(): React.ReactElement {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const dispatch = useDispatch()

  const { acrReponse: acrs } = useSelector((state: RootState) => state.acrReducer)
  const scripts = useSelector((state: RootState) => state.initReducer.scripts)
  const loadingScripts = useSelector((state: RootState) => state.initReducer.loadingScripts)

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
    () => hasCedarReadPermission(authResourceId) === true,
    [hasCedarReadPermission, authResourceId],
  )
  const canWriteAuth = useMemo(
    () => hasCedarWritePermission(authResourceId) === true,
    [hasCedarWritePermission, authResourceId],
  )

  useEffect(() => {
    if (authScopes && authScopes.length > 0) {
      authorizeHelper(authScopes)
    }
  }, [authorizeHelper, authScopes])

  useEffect(() => {
    const userAction: Record<string, unknown> = {}
    buildPayload(userAction, 'Fetch custom scripts', {})
    dispatch(getScripts({ action: userAction }))
    dispatch(getAcrsConfig())
  }, [dispatch])

  // Surface Agama fetch failures
  useEffect(() => {
    if (error) {
      const errorMessage =
        (error as Error)?.message ||
        'Failed to fetch Agama projects. Only showing authentication scripts.'
      console.error('Error fetching Agama projects:', error)
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

  const submitForm = (userMessage: string): void => {
    toggle()

    if (put?.value) {
      const opts: Record<string, unknown> = {
        authenticationMethod: { defaultAcr: put.value },
      }
      const userAction: Record<string, unknown> = {}
      buildPayload(userAction, userMessage, opts)
      dispatch(editAcrs({ data: opts, action: userAction }))
    }
  }

  return (
    <GluuLoader blocking={loadingScripts || agamaLoading}>
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
              disabled={!put?.value || put?.value === acrs?.defaultAcr}
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
