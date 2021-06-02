import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import ScopeForm from './ScopeForm'
import BlockUi from 'react-block-ui'
import { editScope } from '../../redux/actions/ScopeActions'
import { buildPayload } from '../../../../app/utils/PermChecker'

function ScopeEditPage({ scope, loading, dispatch, scripts, attributes }) {
  const userAction = {}
  if (!scope.attributes) {
    scope.attributes = {
      spontaneousClientId: null,
      spontaneousClientScopes: [],
      showInConfigurationEndpoint: false,
    }
  }
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      postBody['scope'] = JSON.parse(data)
      buildPayload(userAction, data.action_message, postBody)
      dispatch(editScope(userAction))
      history.push('/auth-server/scopes')
    }
  }
  return (
    <React.Fragment>
      <Container>
        <BlockUi
          tag="div"
          blocking={loading}
          keepInView={true}
          renderChildren={true}
          message={'Performing the request, please wait!'}
        >
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
        </BlockUi>
      </Container>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    scope: state.scopeReducer.item,
    loading: state.scopeReducer.loading,
    permissions: state.authReducer.permissions,
    scripts: state.customScriptReducer.items,
    attributes: state.attributeReducer.items,
  }
}

export default connect(mapStateToProps)(ScopeEditPage)
