import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import { useHistory } from 'react-router-dom'
import { addNewClientAction } from '../../redux/actions/OIDCActions'
import { getOidcDiscovery } from '../../../../app/redux/actions/OidcDiscoveryActions'
import { getScopes } from '../../redux/actions/ScopeActions'
import { getCustomScripts } from '../../../admin/redux/actions/CustomScriptActions'
import { buildPayload } from '../../../../app/utils/PermChecker'

function ClientAddPage({ permissions, scopes, scripts, loading, dispatch, oidcConfiguration }) {
  const userAction = {}
  const options = {}
  options['limit'] = parseInt(100000)
  useEffect(() => {
    buildPayload(userAction, '', options)
    if (scopes.length < 1) {
      dispatch(getScopes(userAction))
    }
    if (scripts.length < 1) {
      dispatch(getCustomScripts(userAction))
    }
    dispatch(getOidcDiscovery())
  }, [])
  const history = useHistory()
  scopes = scopes.map((item) => ({ dn: item.dn, name: item.id }))
  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      postBody['client'] = data
      buildPayload(userAction, data.action_message, postBody)
      dispatch(addNewClientAction(userAction))
      history.push('/auth-server/clients')
    }
  }
  const clientData = {
    frontChannelLogoutSessionRequired: false,
    includeClaimsInIdToken: false,
    redirectUris: [],
    claimRedirectUris: [],
    responseTypes: [],
    grantTypes: [],
    requireAuthTime: false,
    postLogoutRedirectUris: [],
    oxAuthScopes: [],
    trustedClient: false,
    persistClientAuthorizations: false,
    customAttributes: [],
    customObjectClasses: ['top'],
    rptAsJwt: false,
    accessTokenAsJwt: false,
    backchannelUserCodeParameter: false,
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
      rptClaimsScripts: [],
      consentGatheringScripts: [],
      spontaneousScopeScriptDns: [],
      introspectionScripts: [],
      postAuthnScripts: [],
      additionalAudience: [],
    },
  }
  return (
    <GluuLoader blocking={loading}>
      <ClientWizardForm
        client_data={clientData}
        scopes={scopes}
        scripts={scripts}
        permissions={permissions}
        oidcConfiguration={oidcConfiguration}
        customOnSubmit={handleSubmit}
      />
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    permissions: state.authReducer.permissions,
    scopes: state.scopeReducer.items,
    scripts: state.initReducer.scripts,
    loading: state.oidcReducer.loading,
    oidcConfiguration: state.oidcDiscoveryReducer.configuration,
  }
}
export default connect(mapStateToProps)(ClientAddPage)
