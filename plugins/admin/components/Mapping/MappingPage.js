import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, FormGroup } from '../../../../app/components'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
import PropertyBuilder from './JsonPropertyBuilder'
import { getMapping } from '../../redux/actions/MappingActions'
import config from './apiconfig'
import {
  hasPermission,
  buildPayload,
  ROLE_READ,
} from '../../../../app/utils/PermChecker'

function MappingPage({ mapping, permissions, dispatch }) {
  const { t } = useTranslation()
  const lSize = 6
  const options = []
  const [patches, setPatches] = useState([])
  const userAction = {}
  useEffect(() => {
    buildPayload(userAction, 'ROLES_MAPPING', options)
    dispatch(getMapping(userAction))
  }, [])

  const patchHandler = (patch) => {
    setPatches((existingPatches) => [...existingPatches, patch])
    const newPatches = patches
    newPatches.push(patch)
    setPatches(newPatches)
  }

  return (
    <Card>
      <GluuRibbon title={t('titles.mapping')} fromLeft />
      <CardBody>
        <FormGroup row />
        <FormGroup row />
        <FormGroup row />
        <GluuViewWrapper canShow={hasPermission(permissions, ROLE_READ)}>
          {Object.keys(config.rolePermissionMapping).map((propKey, idx) => (
            <PropertyBuilder
              key={idx}
              propKey={propKey}
              propValue={config.rolePermissionMapping[propKey]}
              lSize={lSize}
              handler={patchHandler}
            />
          ))}
        </GluuViewWrapper>
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    mapping: state.mappingReducer.items,
    permissions: state.authReducer.permissions,
  }
}

export default connect(mapStateToProps)(MappingPage)
