import React, { useEffect } from 'react'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { editClient } from '../../redux/actions/OIDCActions'
import { getScopes } from '../../redux/actions/ScopeActions'
import { getCustomScripts } from '../../../admin/redux/actions/CustomScriptActions'
import { buildPayload } from '../../../../app/utils/PermChecker'

function ClientEditPage({
  client,
  scopes,
  scripts,
  loading,
  permissions,
  dispatch,
}) {
  const userAction = {}
  const options = {}
  options['limit'] = parseInt(100000)
  useEffect(() => {
    buildPayload(userAction, '', options)
    if (scopes.length < 1) {
      dispatch(getScopes(options))
    }
    if (scripts.length < 1) {
      dispatch(getCustomScripts(options))
    }
  }, [])

  if (
    !client.attributes ||
    (Object.keys(client.attributes).length === 0 &&
      client.attributes.constructor === Object)
  ) {
    client.attributes = {
      runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims: false,
      keepClientAuthorizationAfterExpiration: false,
      allowSpontaneousScopes: false,
      backchannelLogoutSessionRequired: false,
    }
  }
  scopes = scopes.map((item) => ({ dn: item.dn, name: item.id }))
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      console.log("================================"+JSON.stringify(data))
      buildPayload(userAction, data.action_message, data)
      dispatch(editClient(userAction))
      history.push('/auth-server/clients')
    }
  }
  return (
    <GluuLoader blocking={loading}>
      <ClientWizardForm
        client={client}
        scopes={scopes}
        scripts={scripts}
        permissions={permissions}
        customOnSubmit={handleSubmit}
      />
    </GluuLoader>
  )
}
const mapStateToProps = (state) => {
  return {
    client: state.oidcReducer.item,
    loading: state.oidcReducer.loading,
    scopes: state.scopeReducer.items,
    scripts: state.initReducer.scripts,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(ClientEditPage)
