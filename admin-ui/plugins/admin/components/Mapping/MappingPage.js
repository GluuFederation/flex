import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import MappingAddDialogForm from './MappingAddDialogForm'
import {
  Card,
  Col,
  CardBody,
  FormGroup,
  Button,
} from 'Components'
import Box from '@material-ui/core/Box'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import {
  getMapping,
  addNewRolePermissions,
} from 'Plugins/admin/redux/actions/MappingActions'
import { getRoles } from 'Plugins/admin/redux/actions/ApiRoleActions'
import { getPermissions } from 'Plugins/admin/redux/actions/ApiPermissionActions'
import MappingItem from './MappingItem'
import {
  hasPermission,
  buildPayload,
  ROLE_READ,
} from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'

function MappingPage({
  mapping,
  apiRoles,
  permissions,
  permissionLoading,
  loading,
  dispatch,
}) {
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const options = []
  const userAction = {}
  SetTitle(t('titles.mapping'))

  function doFetchPermissionsList() {
    buildPayload(userAction, 'PERMISSIONS', options)
    dispatch(getPermissions(userAction))
  }

  useEffect(() => {
    doFetchList()
    doFetchRoles()
    doFetchPermissionsList()
  }, [])

  function onAddConfirmed(mappingData) {
    buildPayload(userAction, 'Add new mapping', mappingData)
    dispatch(addNewRolePermissions(mappingData))
    toggle()
    // doFetchList()
  }

  function doFetchList() {
    buildPayload(userAction, 'ROLES_MAPPING', options)
    dispatch(getMapping(userAction))
  }
  function doFetchRoles() {
    buildPayload(userAction, 'ROLES', options)
    dispatch(getRoles(userAction))
  }

  function showMappingDialog() {
    toggle()
  }
  return (
    <GluuLoader blocking={loading || permissionLoading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={hasPermission(permissions, ROLE_READ)}>
            <FormGroup row>
              <Col sm={10}></Col>
              <Col sm={2}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    type="button"
                    color="primary"
                    style={applicationStyle.buttonStyle}
                    onClick={showMappingDialog}
                  >
                    <i className="fa fa-plus mr-2"></i>
                    Add Mapping
                  </Button>
                </Box>
              </Col>
            </FormGroup>
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

const mapStateToProps = (state) => {
  return {
    mapping: state.mappingReducer.items,
    loading: state.mappingReducer.loading,
    apiRoles: state.apiRoleReducer.items,
    permissions: state.authReducer.permissions,
    permissionLoading: state.apiPermissionReducer.loading,
  }
}

export default connect(mapStateToProps)(MappingPage)
