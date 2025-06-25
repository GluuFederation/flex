import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import ScopeForm from './ScopeForm'
import { addScope } from 'Plugins/auth-server/redux/features/scopeSlice'
import { buildPayload } from 'Utils/PermChecker'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { getAttributes, getScripts } from 'Redux/features/initSlice'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function ScopeAddPage() {
  const loading = useSelector((state) => state.scopeReducer.loading)
  const scripts = useSelector((state) => state.initReducer.scripts)
  const attributes = useSelector((state) => state.initReducer.attributes)
  const [modifiedFields, setModifiedFields] = useState({})
  const saveOperationFlag = useSelector((state) => state.scopeReducer.saveOperationFlag)
  const errorInSaveOperationFlag = useSelector(
    (state) => state.scopeReducer.errorInSaveOperationFlag,
  )

  const dispatch = useDispatch()

  const userAction = {}
  const navigate = useNavigate()
  const { t } = useTranslation()
  useEffect(() => {
    if (attributes.length === 0) {
      buildPayload(userAction, 'Fetch attributes', { limit: 100 })
      dispatch(getAttributes({ options: userAction }))
    }
    if (scripts.length === 0) {
      buildPayload(userAction, 'Fetch custom scripts', {})
      dispatch(getScripts({ action: userAction }))
    }
  }, [])

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) navigate('/auth-server/scopes')
  }, [saveOperationFlag])

  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      data = JSON.parse(data)
      const message = data.action_message
      delete data.action_message
      postBody['scope'] = data
      postBody['modifiedFields'] = modifiedFields
      buildPayload(userAction, message, postBody)
      dispatch(addScope({ action: userAction }))
    }
  }

  const handleSearch = (value) => {
    const option = {
      pattern: value,
    }
    dispatch(getAttributes({ options: option }))
  }

  const scope = {
    claims: [],
    dynamicScopeScripts: [],
    defaultScope: false,
    attributes: {
      spontaneousClientId: null,
      spontaneousClientScopes: [],
      showInConfigurationEndpoint: false,
    },
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={errorInSaveOperationFlag}
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
