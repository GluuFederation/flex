import React, { useEffect } from 'react'
import {
  Container,
  CardBody,
  Card,
  CardHeader,
  FormGroup,
} from '../../../../app/components'
import { useTranslation } from 'react-i18next'

import { buildPayload } from '../../../../app/utils/PermChecker'
import { connect } from 'react-redux'
import { getHealthStatus } from '../../redux/actions/HealthAction'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'

function HealthPage({ serverStatus, dbStatus, dispatch }) {
  const { t } = useTranslation()
  const userAction = {}
  const options = {}

  useEffect(() => {
    buildPayload(userAction, 'GET Health Status', options)
    dispatch(getHealthStatus(userAction))
  }, [])

  return (
    <Container>
      <Card className="mb-3">
        <GluuRibbon title={t('titles.services_health')} fromLeft />
        <FormGroup row />
        <FormGroup row />
        <FormGroup row />
        <CardBody>
          <Card className="mb-3">
            <CardHeader tag="h6" className="bg-success text-white">
              {t('titles.oauth_server_status_title')}
            </CardHeader>
            <CardBody>{serverStatus}</CardBody>
          </Card>
          <Card className="mb-3">
            <CardHeader tag="h6" className="bg-success text-white">
              {t('titles.database_status_title')}
            </CardHeader>
            <CardBody>{dbStatus}</CardBody>
          </Card>
        </CardBody>
      </Card>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    serverStatus: state.healthReducer.serverStatus,
    dbStatus: state.healthReducer.dbStatus,
    loading: state.healthReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(HealthPage)
