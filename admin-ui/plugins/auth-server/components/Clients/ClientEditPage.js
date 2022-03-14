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
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'

function ClientEditPage({
  clientData,
  view_only,
  scopes,
  scripts,
  loading,
  permissions,
  dispatch,
  oidcConfiguration,
  saveOperationFlag,
  errorInSaveOperationFlag,
}) {
  const userAction = {}
  const options = {}
  options['limit'] = parseInt(100000)
  const { t } = useTranslation()
  const history = useHistory()

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
  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag)
      history.push('/auth-server/clients')
  }, [saveOperationFlag])

  if (!clientData.attributes) {
    clientData.attributes = {}
  }
  scopes = scopes.map((item) => ({ dn: item.dn, name: item.id }))

  function handleSubmit(data) {
    if (data) {
      buildPayload(userAction, data.action_message, data)
      dispatch(editClient(userAction))
    }
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
    saveOperationFlag: state.oidcReducer.saveOperationFlag,
    errorInSaveOperationFlag: state.oidcReducer.errorInSaveOperationFlag,
  }
}
export default connect(mapStateToProps)(ClientEditPage)
