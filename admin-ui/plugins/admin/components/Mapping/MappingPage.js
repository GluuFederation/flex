import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { getMapping } from 'Plugins/admin/redux/features/mappingSlice'
import { getRoles } from 'Plugins/admin/redux/features/apiRoleSlice'
import { getPermissions } from 'Plugins/admin/redux/features/apiPermissionSlice'
import MappingItem from './MappingItem'
import { buildPayload } from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { Link } from 'react-router-dom'
import { StickyNote2Outlined } from '@mui/icons-material'

function MappingPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  SetTitle(t('titles.mapping'))
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const { items: mapping, loading } = useSelector((state) => state.mappingReducer)
  const apiRoles = useSelector((state) => state.apiRoleReducer.items)
  const permissionLoading = useSelector((state) => state.apiPermissionReducer.loading)
  const options = []
  const userAction = {}

  const mappingResourceId = useMemo(() => ADMIN_UI_RESOURCES.Security, [])
  const mappingScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[mappingResourceId] || [],
    [mappingResourceId],
  )
  const canReadMapping = useMemo(
    () => hasCedarReadPermission(mappingResourceId) === true,
    [hasCedarReadPermission, mappingResourceId],
  )

  useEffect(() => {
    if (mappingScopes && mappingScopes.length > 0) {
      authorizeHelper(mappingScopes)
    }
  }, [authorizeHelper, mappingScopes])

  useEffect(() => {
    if (!canReadMapping) {
      return
    }
    doFetchList()
    doFetchRoles()
    doFetchPermissionsList()
  }, [canReadMapping])

  function doFetchPermissionsList() {
    buildPayload(userAction, 'PERMISSIONS', options)
    dispatch(getPermissions({ payload: userAction }))
  }

  function doFetchList() {
    buildPayload(userAction, 'ROLES_MAPPING', options)
    dispatch(getMapping({ action: userAction }))
  }
  function doFetchRoles() {
    buildPayload(userAction, 'ROLES', options)
    dispatch(getRoles({ action: userAction }))
  }

  return (
    <GluuLoader blocking={loading || permissionLoading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={canReadMapping}>
            {mapping.map((candidate, idx) => (
              <MappingItem key={idx} candidate={candidate} roles={apiRoles} />
            ))}
          </GluuViewWrapper>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
            <StickyNote2Outlined aria-label="Note" />
            <span>
              {t('documentation.mappings.note_prefix')}{' '}
              <Link to="/adm/cedarlingconfig">Cedarling</Link>{' '}
              {t('documentation.mappings.note_suffix')}
            </span>
          </div>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default MappingPage
