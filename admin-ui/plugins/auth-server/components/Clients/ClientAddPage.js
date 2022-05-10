import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useHistory } from 'react-router-dom'
import { addNewClientAction } from 'Plugins/auth-server/redux/actions/OIDCActions'
import { getOidcDiscovery } from 'Redux/actions/OidcDiscoveryActions'
import { getScopes } from 'Plugins/auth-server/redux/actions/ScopeActions'
import { getScripts } from 'Redux/actions/InitActions'
import { buildPayload } from 'Utils/PermChecker'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'

function ClientAddPage({
  permissions,
  scopes,
  scripts,
  loading,
  dispatch,
  oidcConfiguration,
  saveOperationFlag,
  errorInSaveOperationFlag,
}) {
  const userAction = {}
  const options = {}
  options['limit'] = parseInt(100000)
  const history = useHistory()
  const { t } = useTranslation()
  useEffect(() => {
    buildPayload(userAction, '', options)
    if (scopes.length < 1) {
      dispatch(getScopes(userAction))
    }
    if (scripts.length < 1) {
      dispatch(getScripts(userAction))
    }
    dispatch(getOidcDiscovery())
  }, [])

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag)
      history.push('/auth-server/clients')
  }, [saveOperationFlag])

  scopes = scopes.map((item) => ({ dn: item.dn, name: item.id }))
  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      postBody['client'] = data
      buildPayload(userAction, data.action_message, postBody)
      dispatch(addNewClientAction(userAction))
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
    customObjectClasses: [],
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
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={errorInSaveOperationFlag}
      />
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
    saveOperationFlag: state.oidcReducer.saveOperationFlag,
    errorInSaveOperationFlag: state.oidcReducer.errorInSaveOperationFlag,
  }
}
export default connect(mapStateToProps)(ClientAddPage)
