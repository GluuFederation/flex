import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import ScopeForm from './ScopeForm'
import BlockUi from 'react-block-ui'
import { editScope } from '../../redux/actions/ScopeActions'

function ScopeEditPage({ scope, loading, dispatch, scripts }) {
  if (!scope.attributes) {
    scope.attributes = {
      spontaneousClientId: null,
      spontaneousClientScopes: [],
      showInConfigurationEndpoint: false,
    }
  }
  const history = useHistory()
  function handleSubmit(data) {
    console.log('ScopeEdit :  handleSubmit() - data = ' + data)
    if (data) {
      const postBody = {}
      postBody['scope'] = JSON.parse(data)
      dispatch(editScope(postBody))
      history.push('/scopes')
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
              <ScopeForm scope={scope} handleSubmit={handleSubmit} />
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
    scripts: state.initReducer.scripts,
  }
}

export default connect(mapStateToProps)(ScopeEditPage)
