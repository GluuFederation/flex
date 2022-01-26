import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import ScopeForm from './ScopeForm'
import { addScope } from '../../redux/actions/ScopeActions'
import { buildPayload } from '../../../../app/utils/PermChecker'

function ScopeAddPage({ scripts, dispatch, attributes }) {
  const userAction = {}
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      data = JSON.parse(data)
      let message = data.action_message
      delete data.action_message
      postBody['scope'] = data
      buildPayload(userAction, message, postBody)
      dispatch(addScope(userAction))
      history.push('/auth-server/scopes')
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
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <ScopeForm
              scope={scope}
              scripts={scripts}
              attributes={attributes}
              handleSubmit={handleSubmit}
            />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    loading: state.scopeReducer.loading,
    permissions: state.authReducer.permissions,
    scripts: state.initReducer.scripts,
    attributes: state.initReducer.attributes,
  }
}
export default connect(mapStateToProps)(ScopeAddPage)
