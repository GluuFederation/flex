import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CardBody, Card } from '../../../../app/components'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import ScopeForm from './ScopeForm'
import { editScope } from '../../redux/actions/ScopeActions'
import { buildPayload } from '../../../../app/utils/PermChecker'

function ScopeEditPage({ scope, loading, dispatch, scripts, attributes }) {
  const userAction = {}
  const history = useHistory()
  if (!scope.attributes) {
    scope.attributes = {
      spontaneousClientId: null,
      spontaneousClientScopes: [],
      showInConfigurationEndpoint: false,
    }
  }

  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      data = JSON.parse(data)
      let message = data.action_message
      delete data.action_message
      postBody['scope'] = data
      buildPayload(userAction, message, postBody)
      dispatch(editScope(userAction))
      history.push('/auth-server/scopes')
    }
  }
  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3">
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
  }
}

export default connect(mapStateToProps)(ScopeEditPage)
