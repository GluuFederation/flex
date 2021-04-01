import React from 'react'
import { connect } from 'react-redux'
import ClientWizardForm from './ClientWizardForm'
import { useHistory } from 'react-router-dom'
import { addClient } from '../../../redux/actions/OpenidClientActions'
import BlockUi from 'react-block-ui'
function ClientAddPage({ permissions, loading, dispatch }) {
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      postBody['client'] = data
      dispatch(addClient(postBody))
      setTimeout(
        function() {
          history.push('/clients')
        }, 10000);
    }
  }
  const client = {
    frontChannelLogoutSessionRequired: false,
    includeClaimsInIdToken: false,
    redirectUris: [],
    claimRedirectUris: [],
    responseTypes: [],
    grantTypes: [],
    requireAuthTime: false,
    postLogoutRedirectUris: [],
    scopes: [],
    trustedClient: true,
    persistClientAuthorizations: false,
    customAttributes: [],
    customObjectClasses: [],
    rptAsJwt: false,
    accessTokenAsJwt: false,
    disabled: false,
    runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims: false,
    keepClientAuthorizationAfterExpiration: false,
    allowSpontaneousScopes: false,
    backchannelLogoutSessionRequired: false,
    attributes: {
      runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims: false,
      keepClientAuthorizationAfterExpiration: false,
      allowSpontaneousScopes: false,
      backchannelLogoutSessionRequired: false,
    },
  }
  return (
    <React.Fragment>
      <BlockUi
        tag="div"
        blocking={loading}
        keepInView={true}
        renderChildren={true}
        message={'Performing the request, please wait!'}
      >
        <ClientWizardForm
          client={client}
          permissions={permissions}
          customOnSubmit={handleSubmit}
        />
      </BlockUi>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    permissions: state.oidcReducer.permissions,
    loading: state.oidcReducer.loading,
  }
}
export default connect(mapStateToProps)(ClientAddPage)
