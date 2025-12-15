import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { addNewClientAction } from 'Plugins/auth-server/redux/features/oidcSlice'
import { getOidcDiscovery } from 'Redux/features/oidcDiscoverySlice'
import { emptyScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import { getScripts } from 'Redux/features/initSlice'
import { buildPayload } from 'Utils/PermChecker'

function ClientAddPage() {
  const permissions = useSelector((state) => state.authReducer.permissions)
  let scopes = useSelector((state) => state.scopeReducer.items)
  const scripts = useSelector((state) => state.initReducer.scripts)
  const loading = useSelector((state) => state.oidcReducer.loading)
  const oidcConfiguration = useSelector((state) => state.oidcDiscoveryReducer.configuration)
  const saveOperationFlag = useSelector((state) => state.oidcReducer.saveOperationFlag)
  const errorInSaveOperationFlag = useSelector(
    (state) => state.oidcReducer.errorInSaveOperationFlag,
  )
  const [modifiedFields, setModifiedFields] = useState({})

  const dispatch = useDispatch()

  const userAction = {}
  const options = {}
  options['limit'] = parseInt(100000)
  const { navigateToRoute } = useAppNavigation()
  useEffect(() => {
    dispatch(emptyScopes())
    buildPayload(userAction, '', options)
    if (scripts.length < 1) {
      dispatch(getScripts({ action: userAction }))
    }
    dispatch(getOidcDiscovery())
  }, [])

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) {
      navigateToRoute(ROUTES.AUTH_SERVER_CLIENTS_LIST)
    }
  }, [saveOperationFlag, navigateToRoute])

  scopes = scopes?.map((item) => ({ dn: item.dn, name: item.id }))
  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      postBody['client'] = data
      buildPayload(userAction, data.action_message, postBody)
      delete userAction.action_data.client.action_message
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
    attributes: {
      tlsClientAuthSubjectDn: null,
      runIntrospectionScriptBeforeJwtCreation: false,
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
        modifiedFields={modifiedFields}
        setModifiedFields={setModifiedFields}
      />
    </GluuLoader>
  )
}

export default ClientAddPage
