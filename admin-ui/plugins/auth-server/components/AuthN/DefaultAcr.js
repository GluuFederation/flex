import React, { useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useTranslation } from 'react-i18next'
import { ACR_READ, ACR_WRITE } from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { getAcrsConfig, editAcrs } from 'Plugins/auth-server/redux/features/acrSlice'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { buildPayload } from 'Utils/PermChecker'
import { Button, Form } from 'Components'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import { ThemeContext } from '@/context/theme/themeContext'
import DefaultAcrInput from '../Configuration/DefaultAcrInput'
import { getScripts } from 'Redux/features/initSlice'
import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'

function DefaultAcr({ _acrData, _isLoading }) {
  const { hasCedarPermission } = useCedarling()
  const dispatch = useDispatch()
  const acrs = useSelector((state) => state.acrReducer.acrReponse)
  const { scripts } = useSelector((state) => state.initReducer)

  const { t } = useTranslation()

  const [modal, setModal] = useState(false)
  const [put, setPut] = useState(null)
  const userAction = {}
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  SetTitle('ACR Management')

  const authScripts = scripts
    .filter((item) => item.scriptType === 'person_authentication')
    .filter((item) => item.enabled)
    .map((item) => item.name)

  authScripts.push(SIMPLE_PASSWORD_AUTH)

  const toggle = () => {
    setModal(!modal)
  }

  const putHandler = (putData) => {
    setPut(putData)
  }

  const handleSubmit = () => {
    setModal(true)
  }

  const submitForm = (userMessage) => {
    toggle()
    if (put) {
      const opts = {}
      opts['authenticationMethod'] = { defaultAcr: put.value || acrs.defaultAcr }

      buildPayload(userAction, userMessage, opts)
      dispatch(editAcrs({ data: opts }))
    }
  }

  return (
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
          <Button color={`primary-${selectedTheme}`} onClick={handleSubmit}>
            <i className="fa fa-check-circle me-2"></i>
            {t('actions.save')}
          </Button>
        )}
      </div>
    </Form>
  )
}

const DefaultAcrComponent = () => {
  const { authorize } = useCedarling()
  const dispatch = useDispatch()
  const { acrReponse, loading } = useSelector((state) => state.acrReducer)
  const { loading: scriptLoading } = useSelector((state) => state.initReducer)

  const userAction = {}

  useEffect(() => {
    const initializeAcr = async () => {
      try {
        await authorize([ACR_WRITE, ACR_READ])
      } catch (error) {
        console.error('Error initializing ACR configuration:', error)
      }
    }
    initializeAcr()
    dispatch(getAcrsConfig())
    dispatch(getScripts({ action: userAction }))
  }, [authorize, dispatch])

  return (
    <GluuLoader blocking={loading || scriptLoading}>
      <DefaultAcr acrData={acrReponse} isLoading={loading} />
    </GluuLoader>
  )
}

export default DefaultAcrComponent
