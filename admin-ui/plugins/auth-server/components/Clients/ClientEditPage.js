import React, { useEffect } from 'react'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { editClient } from 'Plugins/auth-server/redux/features/oidcSlice'
import { getScopeByCreator, emptyScopes} from 'Plugins/auth-server/redux/features/scopeSlice'
import { getOidcDiscovery } from 'Redux/features/oidcDiscoverySlice'
import { getUMAResourcesByClient } from 'Plugins/auth-server/redux/features/umaResourceSlice'
import { getScripts } from 'Redux/features/initSlice'
import { buildPayload } from 'Utils/PermChecker'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import isEmpty from 'lodash/isEmpty'

function ClientEditPage() {
  const clientData = useSelector((state) => state.oidcReducer.item)
  const viewOnly = useSelector((state) => state.oidcReducer.view)
  const loading = useSelector((state) => state.oidcReducer.loading)
  let scopes = useSelector((state) => state.scopeReducer.items)
  const scripts = useSelector((state) => state.initReducer.scripts)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const oidcConfiguration = useSelector((state) => state.oidcDiscoveryReducer.configuration)
  const saveOperationFlag = useSelector((state) => state.oidcReducer.saveOperationFlag)
  const errorInSaveOperationFlag = useSelector((state) => state.oidcReducer.errorInSaveOperationFlag)
  const umaResources = useSelector((state) => state.umaResourceReducer.items)
  const loadingOidcDiscovevry = useSelector((state) => state.oidcDiscoveryReducer.loading)

  const dispatch = useDispatch()
  const userAction = {}
  const options = {}
  options['limit'] = parseInt(100000)
  const { t } = useTranslation()
  const navigate =useNavigate()

  useEffect(() => {
    dispatch(emptyScopes())
    dispatch(getScopeByCreator({ action: { inum: clientData.inum } }))
    buildPayload(userAction, '', options)
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
    <GluuLoader blocking={loading || loadingOidcDiscovevry}>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={errorInSaveOperationFlag}
      />
      {!(loadingOidcDiscovevry || loading) && 
        <>
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
        </>
      } 
    </GluuLoader>
  )
}

export default ClientEditPage
