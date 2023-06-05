import React, { useEffect } from 'react'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { editClient } from 'Plugins/auth-server/redux/features/oidcSlice'
import { getScopes, getScopeByCreator } from 'Plugins/auth-server/redux/features/scopeSlice'
import { getOidcDiscovery } from 'Redux/actions/OidcDiscoveryActions'
import { getUMAResourcesByClient } from 'Plugins/auth-server/redux/features/umaResourceSlice'
import { getScripts } from 'Redux/features/initSlice'
import { buildPayload } from 'Utils/PermChecker'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import isEmpty from 'lodash/isEmpty'

function ClientEditPage({
  clientData,
  viewOnly,
  scopes,
  scripts,
  loading,
  permissions,
  dispatch,
  oidcConfiguration,
  saveOperationFlag,
  errorInSaveOperationFlag,
  umaResources,
}) {
  const userAction = {}
  const options = {}
  options['limit'] = parseInt(100000)
  const { t } = useTranslation()
  const navigate =useNavigate()

  useEffect(() => {
    dispatch(getScopeByCreator({ action: { inum: clientData.inum } }))
    buildPayload(userAction, '', options)
    if (scopes.length < 1) {
      dispatch(getScopes({ action: options }))
    }
    if (scripts.length < 1) {
      dispatch(getScripts({ action: options }))
    }
    if (isEmpty(umaResources)) {
      dispatch(getUMAResourcesByClient({ inum: clientData?.inum }))
    }
    dispatch(getOidcDiscovery())
  }, [])
  useEffect(() => {
    if (saveOperationFlag)
      navigate('/auth-server/clients')
  }, [saveOperationFlag])

  if (!clientData.attributes) {
    clientData.attributes = {}
  }
  scopes = scopes?.map((item) => ({
    ...item,
    name: item.id,
  }))

  function handleSubmit(data) {
    if (data) {
      buildPayload(userAction, data.action_message, data)
      dispatch(editClient({ action: userAction }))
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
        client_data={{ ...clientData }}
        viewOnly={viewOnly}
        scopes={scopes}
        scripts={scripts}
        permissions={permissions}
        oidcConfiguration={oidcConfiguration}
        customOnSubmit={handleSubmit}
        umaResources={umaResources}
      />
    </GluuLoader>
  )
}
const mapStateToProps = (state) => {
  return {
    clientData: state.oidcReducer.item,
    viewOnly: state.oidcReducer.view,
    loading: state.oidcReducer.loading,
    scopes: state.scopeReducer.items,
    scripts: state.initReducer.scripts,
    permissions: state.authReducer.permissions,
    oidcConfiguration: state.oidcDiscoveryReducer.configuration,
    saveOperationFlag: state.oidcReducer.saveOperationFlag,
    errorInSaveOperationFlag: state.oidcReducer.errorInSaveOperationFlag,
    umaResources: state.umaResourceReducer.items,
  }
}
export default connect(mapStateToProps)(ClientEditPage)
