import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import MappingAddDialogForm from './MappingAddDialogForm'
import {
  Card,
  Col,
  CardBody,
  FormGroup,
  Button,
} from '../../../../app/components'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
import { getMapping } from '../../redux/actions/MappingActions'
import { getRoles } from '../../redux/actions/ApiRoleActions'
import MappingItem from './MappingItem'
import {
  hasPermission,
  buildPayload,
  ROLE_READ,
} from '../../../../app/utils/PermChecker'

function MappingPage({ mapping, apiRoles, permissions, dispatch }) {
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const options = []
  const userAction = {}
  useEffect(() => {
    doFetchList()
    doFetchRoles()
  }, [])

  function onAddConfirmed(mappingData) {
    buildPayload(userAction, 'Add new mapping', mappingData)
    toggle()
    doFetchList()
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
    <Card>
      <GluuRibbon title={t('titles.mapping')} fromLeft />
      <CardBody>
        <FormGroup row />
        <FormGroup row />
        <GluuViewWrapper canShow={hasPermission(permissions, ROLE_READ)}>
          <FormGroup row>
            <Col sm={10}></Col>
            <Col sm={2}>
              <Button
                type="button"
                color="primary"
                style={applicationStyle.buttonStyle}
                onClick={showMappingDialog}
              >
                <i className="fa fa-plus mr-2"></i>
                Add Mapping
              </Button>
            </Col>
          </FormGroup>
          {mapping.map((candidate, idx) => (
            <MappingItem key={idx} candidate={candidate} />
          ))}
        </GluuViewWrapper>
        <MappingAddDialogForm
          roles={apiRoles}
          handler={toggle}
          modal={modal}
          onAccept={onAddConfirmed}
        />
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    mapping: state.mappingReducer.items,
    apiRoles: state.apiRoleReducer.items,
    permissions: state.authReducer.permissions,
  }
}

export default connect(mapStateToProps)(MappingPage)
