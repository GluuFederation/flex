import React, { useEffect, useContext } from 'react'
import {
  CardBody,
  Card,
  CardHeader,
} from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { buildPayload } from 'Utils/PermChecker'
import { useDispatch, useSelector } from 'react-redux'
import { getHealthStatus } from 'Redux/features/healthSlice'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SetTitle from 'Utils/SetTitle'
import { Box } from '@mui/material'

// Type definitions
interface RootState {
  healthReducer: {
    serverStatus: string | null
    dbStatus: string | null
    health: Record<string, any>
    loading: boolean
  }
}

interface UserAction {
  [key: string]: any
}

interface Options {
  [key: string]: any
}

function HealthPage(): JSX.Element {
  const serverStatus = useSelector((state: RootState) => state.healthReducer.serverStatus)
  const dbStatus = useSelector((state: RootState) => state.healthReducer.dbStatus)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || 'darkBlack'
  const themeColors = getThemeColor(selectedTheme)
  const userAction: UserAction = {}
  const options: Options = {}
  SetTitle(t('titles.services_health'))

  useEffect(() => {
    fetchHealthInfo()
  }, [])

  function fetchHealthInfo(): void {
    buildPayload(userAction, 'GET Health Status', options)
    dispatch(getHealthStatus())
  }

  function isUp(status: string | null): boolean {
    if (status) {
      return (
        status.toUpperCase() === 'ONLINE'.toUpperCase() ||
        status.toUpperCase() === 'RUNNING'.toUpperCase()
      )
    }
    return false
  }

  return (
    <Card className="mb-3" {...applicationStyle.mainCard} type="border" color={null}>
      <CardBody>
        <Box display='flex' flexDirection='column' gap={2}>
          <Card className="mb-3" {...applicationStyle.buttonStyle} type="border" color={null}>
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
          <Card className="mb-3" {...applicationStyle.buttonStyle} type="border" color={null}>
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
        </Box>
      </CardBody>
    </Card>
  )
}

export default HealthPage
