import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import ScopeForm from './ScopeForm'
import { buildPayload } from 'Utils/PermChecker'
import { getAttributes, getScripts } from 'Redux/features/initSlice'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { editScope } from 'Plugins/auth-server/redux/features/scopeSlice'
import { cloneDeep } from 'lodash'

function ScopeEditPage() {
  const userAction = {}
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [modifiedFields, setModifiedFields] = useState({})
  const scope = useSelector((state) => state.scopeReducer.item)
  const extensbileScope = cloneDeep(scope)
  const loading = useSelector((state) => state.scopeReducer.loading)
  const scripts = useSelector((state) => state.initReducer.scripts)
  const attributes = useSelector((state) => state.initReducer.attributes)
  const saveOperationFlag = useSelector((state) => state.scopeReducer.saveOperationFlag)
  const errorInSaveOperationFlag = useSelector(
    (state) => state.scopeReducer.errorInSaveOperationFlag,
  )

  const dispatch = useDispatch()

  if (!extensbileScope.attributes) {
    extensbileScope.attributes = {
      spontaneousClientId: null,
      spontaneousClientScopes: [],
      showInConfigurationEndpoint: false,
    }
  }
  useEffect(() => {
    if (attributes.length === 0) {
      buildPayload(userAction, 'Fetch attributes', {})
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
      dispatch(editScope({ action: userAction }))
    }
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
            scope={{
              ...extensbileScope,
              attributes: extensbileScope?.attributes && { ...extensbileScope?.attributes },
            }}
            attributes={attributes}
            scripts={scripts}
            handleSubmit={handleSubmit}
            modifiedFields={modifiedFields}
            setModifiedFields={setModifiedFields}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ScopeEditPage
