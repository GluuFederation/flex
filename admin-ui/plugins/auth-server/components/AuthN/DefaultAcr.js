import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useTranslation } from 'react-i18next'
import { ACR_READ, ACR_WRITE } from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { getAcrsConfig, editAcrs } from 'Plugins/auth-server/redux/features/acrSlice'
import { getAgama } from 'Plugins/auth-server/redux/features/agamaSlice'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { buildPayload } from 'Utils/PermChecker'
import { Button, Form } from 'Components'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import { ThemeContext } from '@/context/theme/themeContext'
import DefaultAcrInput from '../Configuration/DefaultAcrInput'
import { getScriptsByType } from 'Plugins/auth-server/redux/features/scriptSlice'
import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'

function DefaultAcr() {
  const { hasCedarPermission, authorize } = useCedarling()
  const dispatch = useDispatch()

  const { acrReponse: acrs } = useSelector((state) => state.acrReducer)
  const { scripts } = useSelector((state) => state.scriptReducer)
  const { agamaList, loading: agamaLoading } = useSelector((state) => state.agamaReducer)

  const { t } = useTranslation()

  const [modal, setModal] = useState(false)
  const [put, setPut] = useState(null)
  const userAction = {}
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  SetTitle(t('titles.acr_management'))

  useEffect(() => {
    const initializeAcr = async () => {
      try {
        await authorize([ACR_WRITE, ACR_READ])
      } catch (error) {
        console.error('Error authorizing ACR permissions:', error)
      }
    }

    initializeAcr()
    dispatch(getScriptsByType({ action: { type: 'PERSON_AUTHENTICATION' } }))
    dispatch(getAgama())
    dispatch(getAcrsConfig())
  }, [authorize, dispatch])

  const authScripts = useMemo(() => {
    const filteredScripts = Array.isArray(scripts)
      ? scripts
          .filter(
            (item) =>
              item && item.scriptType?.toUpperCase() === 'PERSON_AUTHENTICATION' && item.enabled,
          )
          .map((item) => item.name)
          .filter(Boolean)
      : []

    // const agamaFlows = Array.isArray(agamaList)
    //   ? agamaList.map((flow) => flow?.details?.projectMetadata?.projectName).filter(Boolean)
    //   : []
    const agamaFlows = []

    const result = Array.from(
      new Set([...filteredScripts, SIMPLE_PASSWORD_AUTH, ...agamaFlows]),
    ).sort()
    return result
  }, [scripts, agamaList])

  const toggle = () => {
    setModal(!modal)
  }

  const putHandler = (putData) => {
    setPut(putData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setModal(true)
  }

  const handleSaveClick = () => {
    setModal(true)
  }

  const submitForm = (userMessage) => {
    toggle()

    if (put?.value) {
      const opts = {}
      opts['authenticationMethod'] = { defaultAcr: put?.value }

      buildPayload(userAction, userMessage, opts)
      dispatch(editAcrs({ data: opts, action: userAction }))
    } else {
      console.error('No ACR value to save')
    }
  }

  return (
    <GluuLoader blocking={agamaLoading}>
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
