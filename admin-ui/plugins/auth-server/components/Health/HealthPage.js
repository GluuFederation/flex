import React, { useEffect } from 'react'
import {
  Container,
  CardBody,
  Card,
  Badge,
  CardHeader,
  FormGroup,
} from '../../../../app/components'
import { useTranslation } from 'react-i18next'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { buildPayload } from '../../../../app/utils/PermChecker'
import { connect } from 'react-redux'
import { getHealthStatus } from '../../redux/actions/HealthAction'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'

function HealthPage({ serverStatus, dbStatus, dispatch }) {
  const { t } = useTranslation()
  const userAction = {}
  const options = {}

  useEffect(() => {
    fetchHealthInfo(userAction, options, dispatch)
  }, [])

  function fetchHealthInfo() {
    buildPayload(userAction, 'GET Health Status', options)
    dispatch(getHealthStatus(userAction))
  }

  function getColor(status) {
    return isUp(status) ? 'primary' : 'danger'
  }

  function isUp(status) {
    if (status) {
      return (
        status.toUpperCase() === 'ONLINE'.toUpperCase() ||
        status.toUpperCase() === 'RUNNING'.toUpperCase()
      )
    }
    return false
  }

  return (
    <Container>
      <Card className="mb-3">
        <GluuRibbon title={t('titles.services_health')} fromLeft />
        <FormGroup row />
        <FormGroup row />
        <FormGroup row />
        <CardBody>
          <Card className="mb-3" style={applicationStyle.buttonStyle}>
            <CardHeader tag="h6" className="text-white">
              {t('titles.oauth_server_status_title')}
            </CardHeader>
            <CardBody
              style={
                isUp(serverStatus)
                  ? applicationStyle.healthUp
                  : applicationStyle.healthDown
              }
            >
              {serverStatus && (
                <Badge color={getColor(serverStatus)}>{serverStatus}</Badge>
              )}
            </CardBody>
          </Card>
          <Card className="mb-3" style={applicationStyle.buttonStyle}>
            <CardHeader tag="h6" className="text-white">
              {t('titles.database_status_title')}
            </CardHeader>
            <CardBody
              style={
                isUp(dbStatus)
                  ? applicationStyle.healthUp
                  : applicationStyle.healthDown
              }
            >
              {dbStatus && <Badge color={getColor(dbStatus)}>{dbStatus}</Badge>}
            </CardBody>
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
