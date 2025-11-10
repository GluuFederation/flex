import { useEffect } from 'react'
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
import { buildPayload, MAPPING_WRITE, MAPPING_READ } from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { useCedarling } from '@/cedarling'
import { Link } from 'react-router-dom'
import { StickyNote2Outlined } from '@mui/icons-material'

function MappingPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  SetTitle(t('titles.mapping'))
  const { hasCedarPermission, authorize } = useCedarling()

  const { items: mapping, loading } = useSelector((state) => state.mappingReducer)
  const apiRoles = useSelector((state) => state.apiRoleReducer.items)
  const permissionLoading = useSelector((state) => state.apiPermissionReducer.loading)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)
  const options = []
  const userAction = {}

  const authorizePermissions = async () => {
    const permissions = [MAPPING_READ, MAPPING_WRITE]
    try {
      for (const permission of permissions) {
        await authorize([permission])
      }
    } catch (error) {
      console.error('Error authorizing mapping permissions:', error)
    }
  }

  useEffect(() => {
    authorizePermissions()
    doFetchList()
    doFetchRoles()
    doFetchPermissionsList()
  }, [])

  useEffect(() => {}, [cedarPermissions])

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
          <GluuViewWrapper canShow={hasCedarPermission(MAPPING_READ)}>
            {mapping.map((candidate, idx) => (
              <MappingItem key={idx} candidate={candidate} roles={apiRoles} />
            ))}
          </GluuViewWrapper>
          <StickyNote2Outlined /> <Link to="/adm/cedarlingconfig">Cedarling</Link>{' '}
          {t('documentation.mappings.note')}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default MappingPage
