import React from 'react'
import { connect } from 'react-redux'
import ClientWizardForm from './ClientWizardForm'
import { useHistory } from 'react-router-dom'
import { addNewClientAction } from '../../../redux/actions/OIDCActions'
import BlockUi from 'react-block-ui'
function ClientAddPage({ permissions, scopes, scripts, loading, dispatch }) {
  const history = useHistory()
  scopes = scopes.map((item) => item.id)
  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      postBody['client'] = data
      dispatch(addNewClientAction(postBody))
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
    runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims: false,
    keepClientAuthorizationAfterExpiration: false,
    allowSpontaneousScopes: false,
    backchannelLogoutSessionRequired: false,
    attributes: {
      tlsClientAuthSubjectDn: null,
      runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims: false,
      keepClientAuthorizationAfterExpiration: false,
      allowSpontaneousScopes: false,
      backchannelLogoutSessionRequired: false,
      backchannelLogoutUri: [],
      additionalAudience: [],
      rptClaimsScripts: [],
      consentGatheringScripts: [],
      spontaneousScopeScriptDns: [],
      introspectionScripts: [],
      postAuthnScripts: [],
      additionalAudience: [],
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
          scopes={scopes}
          scripts={scripts}
          permissions={permissions}
          customOnSubmit={handleSubmit}
        />
      </BlockUi>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    permissions: state.authReducer.permissions,
    scopes: state.scopeReducer.items,
    scripts: state.initReducer.scripts,
    loading: state.oidcReducer.loading,
  }
}
export default connect(mapStateToProps)(ClientAddPage)
