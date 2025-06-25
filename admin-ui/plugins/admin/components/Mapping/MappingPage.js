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
import { hasPermission, buildPayload, MAPPING_WRITE, MAPPING_READ } from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'

function MappingPage() {
  const dispatch = useDispatch()
  const mapping = useSelector((state) => state.mappingReducer.items)
  const loading = useSelector((state) => state.mappingReducer.loading)
  const apiRoles = useSelector((state) => state.apiRoleReducer.items)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const permissionLoading = useSelector((state) => state.apiPermissionReducer.loading)
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const options = []
  const userAction = {}
  SetTitle(t('titles.mapping'))
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  function doFetchPermissionsList() {
    buildPayload(userAction, 'PERMISSIONS', options)
    dispatch(getPermissions({ payload: userAction }))
  }

  useEffect(() => {
    doFetchList()
    doFetchRoles()
    doFetchPermissionsList()
  }, [])

  function onAddConfirmed(mappingData) {
    buildPayload(userAction, 'Add new mapping', mappingData)
    dispatch(addNewRolePermissions({ data: mappingData }))
    toggle()
    // doFetchList()
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
          <GluuViewWrapper canShow={hasPermission(permissions, MAPPING_READ)}>
            {hasPermission(permissions, MAPPING_WRITE) ? (
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
            ) : null}
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
