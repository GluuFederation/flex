import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, FormGroup } from '../../../../app/components'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
//import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { getMapping } from '../../redux/actions/ApiRoleMappingActions'
import {
  hasPermission,
  buildPayload,
  ROLE_READ,
} from '../../../../app/utils/PermChecker'

function RoleMappingPage({ mapping, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  console.log('============== ' + JSON.stringify(mapping))
  console.log('============== ' + JSON.stringify(loading))
  const options = []
  const userAction = {}
  useEffect(() => {
    buildPayload(userAction, 'ROLES_MAPPING', options)
    dispatch(getMapping(userAction))
  }, [])
  return (
    <Card>
      <GluuRibbon title={t('titles.mapping')} fromLeft />
      <CardBody>
        <FormGroup row />
        <FormGroup row />
        <GluuViewWrapper
          canShow={hasPermission(permissions, ROLE_READ)}
        ></GluuViewWrapper>
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    mapping: state.apiMappingReducer.items,
    loading: state.apiMappingReducer.loading,
    permissions: state.authReducer.permissions,
  }
}

export default connect(mapStateToProps)(RoleMappingPage)
