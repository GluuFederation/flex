import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useTranslation } from 'react-i18next'
import { ACR_READ, ACR_WRITE } from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { getAcrsConfig, editAcrs } from 'Plugins/auth-server/redux/features/acrSlice'
import { useGetAgamaPrj, type Deployment } from 'JansConfigApi'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { buildPayload } from 'Utils/PermChecker'
import { Button, Form } from 'Components'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import { ThemeContext } from '@/context/theme/themeContext'
import DefaultAcrInput from '../Configuration/DefaultAcrInput'
import { getScripts } from 'Redux/features/initSlice'
import { buildAgamaFlowsArray, buildDropdownOptions, type DropdownOption } from './helper/acrUtils'

const MAX_AGAMA_PROJECTS_FOR_ACR = 9999

interface CustomScript {
  name: string
  scriptType: string
  enabled: boolean
  [key: string]: any
}

interface AcrState {
  acrReponse?: {
    defaultAcr?: string
  }
  loading: boolean
  error: string | null
}

interface InitState {
  scripts: CustomScript[]
  loadingScripts: boolean
}

interface RootState {
  acrReducer: AcrState
  initReducer: InitState
}

interface PutData {
  value: string
  path?: string
  op?: string
}

function DefaultAcr(): React.ReactElement {
  const { hasCedarPermission, authorize } = useCedarling()
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
  const selectedTheme = theme.state.theme

  const userAction: Record<string, unknown> = {}

  useEffect(() => {
    const initializeAcr = async (): Promise<void> => {
      try {
        await authorize([ACR_WRITE, ACR_READ])
      } catch (error) {
        console.error('Error authorizing ACR permissions:', error)
      }
    }

    initializeAcr()
    buildPayload(userAction, 'Fetch custom scripts', {})
    dispatch(getScripts({ action: userAction }))
    dispatch(getAcrsConfig())
  }, [authorize, dispatch])

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
      const opts: Record<string, unknown> = {}
      opts['authenticationMethod'] = { defaultAcr: put.value }

      buildPayload(userAction, userMessage, opts)
      dispatch(editAcrs({ data: opts, action: userAction }))
    }
  }

  return (
    <GluuLoader blocking={loadingScripts || agamaLoading}>
      <Form onSubmit={handleSubmit}>
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
        <div style={{ padding: '3vh' }}>
          <GluuViewWrapper canShow={hasCedarPermission(ACR_READ)}>
            <DefaultAcrInput
              id="defaultAcr"
              name="defaultAcr"
              lsize={6}
              rsize={6}
              type="select"
              label={t('fields.default_acr')}
              handler={putHandler}
              value={acrs?.defaultAcr}
              options={authScripts}
              path={'/ACR'}
              showSaveButtons={false}
            />
          </GluuViewWrapper>
          {hasCedarPermission(ACR_WRITE) && (
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
