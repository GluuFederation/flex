import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import ScopeForm from './ScopeForm'
import { editScope } from 'Plugins/auth-server/redux/actions/ScopeActions'
import { buildPayload } from 'Utils/PermChecker'
import {
  getAttributes,
  getScripts
} from 'Redux/actions/InitActions'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function ScopeEditPage({ scope, loading, dispatch, scripts, attributes, saveOperationFlag, errorInSaveOperationFlag }) {
  const userAction = {}
  const navigate =useNavigate()
  const { t } = useTranslation()

  if (!scope.attributes) {
    scope.attributes = {
      spontaneousClientId: null,
      spontaneousClientScopes: [],
      showInConfigurationEndpoint: false,
    }
  }
  useEffect(() => {
    if (attributes.length === 0) {
      buildPayload(userAction, 'Fetch attributes', {})
      dispatch(getAttributes(userAction))
    }
    if (scripts.length === 0) {
      buildPayload(userAction, 'Fetch custom scripts', {})
      dispatch(getScripts(userAction))
    }
  }, [])
  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag)
      navigate('/auth-server/scopes')
  }, [saveOperationFlag])

  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      data = JSON.parse(data)
      const message = data.action_message
      delete data.action_message
      postBody['scope'] = data
      buildPayload(userAction, message, postBody)
      dispatch(editScope(userAction))
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
            scope={scope}
            attributes={attributes}
            scripts={scripts}
            handleSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}
const mapStateToProps = (state) => {
  return {
    scope: state.scopeReducer.item,
    loading: state.scopeReducer.loading,
    permissions: state.authReducer.permissions,
    scripts: state.initReducer.scripts,
    attributes: state.initReducer.attributes,
    saveOperationFlag: state.scopeReducer.saveOperationFlag,
    errorInSaveOperationFlag: state.scopeReducer.errorInSaveOperationFlag,
  }
}

export default connect(mapStateToProps)(ScopeEditPage)
