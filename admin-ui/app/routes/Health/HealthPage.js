import React, { useEffect, useContext } from 'react'
import {
  CardBody,
  Card,
  CardHeader,
} from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { buildPayload } from 'Utils/PermChecker'
import { connect } from 'react-redux'
import { getHealthStatus } from 'Redux/actions/HealthAction'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SetTitle from 'Utils/SetTitle'

function HealthPage({ serverStatus, dbStatus, dispatch }) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const userAction = {}
  const options = {}
  SetTitle(t('titles.services_health'))

  useEffect(() => {
    fetchHealthInfo(userAction, options, dispatch)
  }, [])

  function fetchHealthInfo() {
    buildPayload(userAction, 'GET Health Status', options)
    dispatch(getHealthStatus(userAction))
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
    <Card className="mb-3" style={applicationStyle.mainCard}>
      <CardBody>
        <Card className="mb-3" style={applicationStyle.buttonStyle}>
          <CardHeader tag="h6" className="text-white" style={{ background: themeColors.background }}>
            {t('titles.oauth_server_status_title')}
          </CardHeader>
          <CardBody
            style={
              isUp(serverStatus)
                ? applicationStyle.healthUp
                : applicationStyle.healthDown
            }
          >
            {serverStatus && <h4 className="text-white">{serverStatus}</h4>}
          </CardBody>
        </Card>
        <Card className="mb-3" style={applicationStyle.buttonStyle}>
          <CardHeader tag="h6" className="text-white" style={{ background: themeColors.background }}>
            {t('titles.database_status_title')}
          </CardHeader>
          <CardBody
            style={
              isUp(dbStatus)
                ? applicationStyle.healthUp
                : applicationStyle.healthDown
            }
          >
            {dbStatus && <h4 className="text-white">{dbStatus}</h4>}
          </CardBody>
        </Card>
      </CardBody>
    </Card>
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
