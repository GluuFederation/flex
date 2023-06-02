import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useNavigate } from 'react-router-dom'
import { addNewClientAction } from 'Plugins/auth-server/redux/features/oidcSlice'
import { getOidcDiscovery } from 'Redux/actions/OidcDiscoveryActions'
import { getScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import { getScripts } from 'Redux/features/initSlice'
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
  const navigate =useNavigate()
  const { t } = useTranslation()
  useEffect(() => {
    buildPayload(userAction, '', options)
    if (scopes.length < 1) {
      dispatch(getScopes({ action: userAction }))
    }
    if (scripts.length < 1) {
      dispatch(getScripts({ action: userAction }))
    }
    dispatch(getOidcDiscovery())
  }, [])

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag)
      navigate('/auth-server/clients')
  }, [saveOperationFlag])

  scopes = scopes?.map((item) => ({ dn: item.dn, name: item.id }))
  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      postBody['client'] = data
      buildPayload(userAction, data.action_message, postBody)
      dispatch(addNewClientAction({ action: userAction }))
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
