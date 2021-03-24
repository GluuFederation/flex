import React from 'react'
import { connect } from 'react-redux'
import ClientWizardForm from './ClientWizardForm'
import { useHistory } from 'react-router-dom'
import { addClient } from '../../../redux/actions/OpenidClientActions'
function ClientAddPage({ permissions, dispatch }) {
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      dispatch(addClient(data))
      history.push('/clients')
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
    attributes: {
      runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims: false,
      keepClientAuthorizationAfterExpiration: false,
      allowSpontaneousScopes: false,
      backchannelLogoutSessionRequired: false,
    },
  }
  return (
    <React.Fragment>
      <ClientWizardForm
        client={client}
        permissions={permissions}
        handleSubmit={handleSubmit}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    permissions: state.openidClientReducer.permissions,
  }
}
export default connect(mapStateToProps)(ClientAddPage)
