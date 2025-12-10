import React, { useEffect, useState } from 'react'
import ClientWizardForm from './ClientWizardForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { editClient } from 'Plugins/auth-server/redux/features/oidcSlice'
import { getScopeByCreator, emptyScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import { getOidcDiscovery } from 'Redux/features/oidcDiscoverySlice'
import { getUMAResourcesByClient } from 'Plugins/auth-server/redux/features/umaResourceSlice'
import { getScripts } from 'Redux/features/initSlice'
import { buildPayload } from 'Utils/PermChecker'
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
  const umaResources = useSelector((state) => state.umaResourceReducer.items)
  const loadingOidcDiscovevry = useSelector((state) => state.oidcDiscoveryReducer.loading)
  const [modifiedFields, setModifiedFields] = useState([])

  const dispatch = useDispatch()
  const userAction = {}
  const options = {}
  options['limit'] = parseInt(100000)
  const { navigateToRoute } = useAppNavigation()

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
    if (saveOperationFlag) {
      navigateToRoute(ROUTES.AUTH_SERVER_CLIENTS_LIST)
    }
  }, [saveOperationFlag, navigateToRoute])

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
      delete userAction?.action_data?.action_message
      dispatch(editClient({ action: userAction }))
    }
  }
  return (
    <GluuLoader blocking={loading || loadingOidcDiscovevry}>
      {!(loadingOidcDiscovevry || loading) && (
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
            isEdit={true}
            modifiedFields={modifiedFields}
            setModifiedFields={setModifiedFields}
          />
        </>
      )}
    </GluuLoader>
  )
}

export default ClientEditPage
