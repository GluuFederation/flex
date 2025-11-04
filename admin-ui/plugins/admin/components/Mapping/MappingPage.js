import React, { useEffect, useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import MappingAddDialogForm from './MappingAddDialogForm'
import { Card, Col, CardBody, FormGroup, Button } from 'Components'
import Box from '@mui/material/Box'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { getMapping, addNewRolePermissions } from 'Plugins/admin/redux/features/mappingSlice'
import { getRoles } from 'Plugins/admin/redux/features/apiRoleSlice'
import { getPermissions } from 'Plugins/admin/redux/features/apiPermissionSlice'
import MappingItem from './MappingItem'
import { buildPayload, MAPPING_WRITE, MAPPING_READ } from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import { useCedarling } from '@/cedarling'

function MappingPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  SetTitle(t('titles.mapping'))
  const { hasCedarPermission, authorize } = useCedarling()

  const { items: mapping, loading } = useSelector((state) => state.mappingReducer)
  const apiRoles = useSelector((state) => state.apiRoleReducer.items)
  const permissionLoading = useSelector((state) => state.apiPermissionReducer.loading)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)
  const options = []
  const userAction = {}
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

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

  function onAddConfirmed(mappingData) {
    const existing = (mapping || []).find((m) => m?.role === mappingData.role)
    const mergedPermissions = Array.from(
      new Set([...(existing?.permissions || []), ...(mappingData?.permissions || [])]),
    )
    const payload = { role: mappingData.role, permissions: mergedPermissions }
    buildPayload(userAction, 'Add new mapping', payload)
    dispatch(addNewRolePermissions({ data: payload }))
    toggle()
  }

  function doFetchList() {
    buildPayload(userAction, 'ROLES_MAPPING', options)
    dispatch(getMapping({ action: userAction }))
  }
  function doFetchRoles() {
    buildPayload(userAction, 'ROLES', options)
    dispatch(getRoles({ action: userAction }))
  }

  function showMappingDialog() {
    toggle()
  }
  return (
    <GluuLoader blocking={loading || permissionLoading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={hasCedarPermission(MAPPING_READ)}>
            {hasCedarPermission(MAPPING_WRITE) && (
              <FormGroup row>
                <Col sm={10}></Col>
                <Col sm={2}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="button"
                      color={`primary-${selectedTheme}`}
                      style={applicationStyle.buttonStyle}
                      onClick={showMappingDialog}
                    >
                      <i className="fa fa-plus me-2"></i>
                      {t('actions.add_mapping')}
                    </Button>
                  </Box>
                </Col>
              </FormGroup>
            )}
            {mapping.map((candidate, idx) => (
              <MappingItem key={idx} candidate={candidate} roles={apiRoles} />
            ))}
          </GluuViewWrapper>
          <FormGroup row />
          <MappingAddDialogForm
            roles={apiRoles}
            handler={toggle}
            modal={modal}
            mapping={mapping}
            onAccept={onAddConfirmed}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default MappingPage
