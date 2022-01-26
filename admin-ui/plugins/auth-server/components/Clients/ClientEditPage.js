import React, { useEffect } from 'react'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { editClient } from '../../redux/actions/OIDCActions'
import { getScopes } from '../../redux/actions/ScopeActions'
import { getOidcDiscovery } from '../../../../app/redux/actions/OidcDiscoveryActions'
import { getScripts } from '../../../../app/redux/actions/InitActions'
import { buildPayload } from '../../../../app/utils/PermChecker'

function ClientEditPage({
  clientData,
  view_only,
  scopes,
  scripts,
  loading,
  permissions,
  dispatch,
  oidcConfiguration,
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
      dispatch(getScripts(options))
    }
    dispatch(getOidcDiscovery())
  }, [])

  if (!clientData.attributes) {
    clientData.attributes = {}
  }
  scopes = scopes.map((item) => ({ dn: item.dn, name: item.id }))
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      buildPayload(userAction, data.action_message, data)
      dispatch(editClient(userAction))
      history.push('/auth-server/clients')
    }
  }

  return (
    <GluuLoader blocking={loading}>
      <ClientWizardForm
        client_data={clientData}
        view_only={view_only}
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
    clientData: state.oidcReducer.item,
    view_only: state.oidcReducer.view,
    loading: state.oidcReducer.loading,
    scopes: state.scopeReducer.items,
    scripts: state.initReducer.scripts,
    permissions: state.authReducer.permissions,
    oidcConfiguration: state.oidcDiscoveryReducer.configuration,
  }
}
export default connect(mapStateToProps)(ClientEditPage)
