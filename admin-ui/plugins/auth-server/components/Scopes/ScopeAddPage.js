import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import ScopeForm from './ScopeForm'
import { addScope } from 'Plugins/auth-server/redux/actions/ScopeActions'
import { buildPayload } from 'Utils/PermChecker'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import {
  getAttributes,
  getScripts
} from 'Redux/actions/InitActions'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function ScopeAddPage({ scripts, dispatch, attributes, loading, saveOperationFlag, errorInSaveOperationFlag }) {
  const userAction = {}
  const history = useHistory()
  const { t } = useTranslation()
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
      history.push('/auth-server/scopes')
  }, [saveOperationFlag])

  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      data = JSON.parse(data)
      const message = data.action_message
      delete data.action_message
      postBody['scope'] = data
      buildPayload(userAction, message, postBody)
      dispatch(addScope(userAction))
    }
  }

  const scope = {
    claims: [],
    dynamicScopeScripts: [],
    defaultScope: false,
    attributes: {
      spontaneousClientId: null,
      spontaneousClientScopes: [],
      showInConfigurationEndpoint: 'false',
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
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}
const mapStateToProps = (state) => {
  return {
    loading: state.scopeReducer.loading,
    permissions: state.authReducer.permissions,
    scripts: state.initReducer.scripts,
    attributes: state.initReducer.attributes,
    saveOperationFlag: state.scopeReducer.saveOperationFlag,
    errorInSaveOperationFlag: state.scopeReducer.errorInSaveOperationFlag,
  }
}
export default connect(mapStateToProps)(ScopeAddPage)
