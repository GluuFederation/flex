import React, { useState, useEffect, useContext, lazy, Suspense } from 'react'
import moment from 'moment'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { getMau } from 'Plugins/admin/redux/features/mauSlice'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { Button, Card, CardFooter, CardBody, FormGroup, Col, Row } from 'Components'
import { hasBoth, buildPayload, STAT_READ, STAT_JANS_READ } from 'Utils/PermChecker'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

const ActiveUsersGraph = lazy(() => import('Routes/Dashboards/Grapths/ActiveUsersGraph'))

// Type definitions
interface MauStatEntry {
  month: number
  mau: number
  client_credentials_access_token_count: number
  authz_code_access_token_count: number
  authz_code_idtoken_count: number
}

interface MauState {
  stat: MauStatEntry[]
  loading: boolean
  startMonth: string
  endMonth: string
}

interface AuthState {
  permissions: string[]
  isAuthenticated: boolean
  userinfo: any
  userinfo_jwt: string | null
  token: { access_token: string; scopes: string[] } | null
  issuer: string | null
  location: Record<string, any>
  config: Record<string, any>
  defaultToken: any
  codeChallenge: string | null
  codeChallengeMethod: string
  codeVerifier: string | null
  backendStatus: {
    active: boolean
    errorMessage: string | null
    statusCode: number | null
  }
  loadingConfig: boolean
  idToken: string | null
  JwtToken: string | null
  authState?: any
}

interface RootState {
  mauReducer: MauState
  authReducer: AuthState
}

interface UserAction {
  action_message?: string
  action_data?: Record<string, any>
  [key: string]: any
}

function MauGraph() {
  const dispatch = useDispatch()
  const statData = useSelector((state: RootState) => state.mauReducer.stat)
  const loading = useSelector((state: RootState) => state.mauReducer.loading)
  const permissions = useSelector((state: RootState) => state.authReducer.permissions)
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || 'darkBlack'
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(3, 'months'))
  const [endDate, setEndDate] = useState<Dayjs>(dayjs())
  const userAction: UserAction = {}
  const options: Record<string, any> = {}

  useEffect(() => {
    if (statData.length === 0 || !statData) {
      search()
    }
  }, [])

  SetTitle(t('fields.monthly_active_users'))

  function search() {
    // options['month'] = getFormattedMonth()
    options['startMonth'] = getYearMonth(startDate.toDate())
    options['endMonth'] = getYearMonth(endDate.toDate())
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau({ action: userAction } as any))
  }

  function doDataAugmentation(input: MauStatEntry[]): MauStatEntry[] {
    const stat = Array.from(input)
    if (stat && stat.length >= 1) {
      const flattendStat = stat.map((entry: MauStatEntry) => entry['month'])
      const aRange = generateDateRange(startDate.toDate(), endDate.toDate())
      for (const ele of aRange) {
        const currentMonth = getYearMonth(new Date(ele))
        if (flattendStat.indexOf(parseInt(currentMonth, 10)) === -1) {
          const newEntry: MauStatEntry = {
            month: parseInt(getYearMonth(new Date(ele)), 10),
            mau: 0,
            client_credentials_access_token_count: 0,
            authz_code_access_token_count: 0,
            authz_code_idtoken_count: 0,
          }
          stat.push(newEntry)
        }
      }
      return Array.from(new Set(stat)).sort(
        (a: MauStatEntry, b: MauStatEntry) =>
          parseInt(a.month.toString(), 10) - parseInt(b.month.toString(), 10),
      )
    }
    return stat
  }

  function getYearMonth(date: Date): string {
    return date.getFullYear() + getMonth(date)
  }

  function getMonth(aDate: Date): string {
    const value = String(aDate.getMonth() + 1)
    if (value.length > 1) {
      return value
    } else {
      return '0' + value
    }
  }

  function generateDateRange(startDate: Date, endDate: Date): string[] {
    const start = moment(startDate)
    const end = moment(endDate)
    const result: string[] = []
    while (end > start || start.format('M') === end.format('M')) {
      result.push(start.format('YYYY-MM') + '-01')
      start.add(1, 'month')
    }
    return result
  }

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      setStartDate(date)
    }
  }

  const handleEndDateChange = (date: Dayjs | null) => {
    if (date) {
      setEndDate(date)
    }
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}>
        <Card style={applicationStyle.mainCard}>
          <CardBody>
            <Row>
              <Col sm={2}></Col>
              <Col sm={6}>
                <GluuLabel
                  label={t('fields.select_date_range')}
                  size="4"
                  style={{ minWidth: '200px', marginBottom: '10px' }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <DatePicker
                        format="MM/DD/YYYY"
                        label={t('dashboard.start_date')}
                        value={startDate}
                        onChange={handleStartDateChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        format="MM/DD/YYYY"
                        label={t('dashboard.end_date')}
                        value={endDate}
                        onChange={handleEndDateChange}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Col>
              <Col sm={4} className="d-flex align-items-end">
                <Button
                  style={{
                    ...applicationStyle.customButtonStyle,
                    marginTop: '10px',
                  }}
                  color={`primary-${selectedTheme}`}
                  onClick={search}
                >
                  <i className="fa fa-search me-2"></i>
                  {t('actions.view')}
                </Button>
              </Col>
            </Row>
            <FormGroup row />
            <FormGroup row />
            <FormGroup row>
              <Col sm={12}>
                <Suspense fallback={<div>Loading...</div>}>
                  <ActiveUsersGraph data={doDataAugmentation(statData)} />
                </Suspense>
              </Col>
            </FormGroup>
          </CardBody>
          <CardFooter className="p-4 bt-0"></CardFooter>
        </Card>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default MauGraph
