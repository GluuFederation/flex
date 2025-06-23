import { useState, useEffect, useContext, lazy, Suspense } from 'react'
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
import dayjs, { Dayjs } from 'dayjs'

const ActiveUsersGraph = lazy(() => import('Routes/Dashboards/Grapths/ActiveUsersGraph'))

// Type definitions
interface StatDataItem {
  month: number
  mau: number
  client_credentials_access_token_count: number
  authz_code_access_token_count: number
  authz_code_idtoken_count: number
}

interface RootState {
  mauReducer: {
    stat: StatDataItem[]
    loading: boolean
  }
  authReducer: {
    permissions: string[]
  }
}

interface UserAction {
  [key: string]: any
}

interface Options {
  [key: string]: any
}

interface DataPoint {
  month: string
  mau: number
}

function MauGraph(): JSX.Element {
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
  const options: Options = {}

  useEffect(() => {
    if (statData.length === 0 || !statData) {
      search()
    }
  }, [])

  SetTitle(t('fields.monthly_active_users'))

  function search(): void {
    // options['month'] = getFormattedMonth()
    options['startMonth'] = getYearMonth(startDate.toDate())
    options['endMonth'] = getYearMonth(endDate.toDate())
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau({ action: userAction }))
  }

  function doDataAugmentation(input: StatDataItem[]): DataPoint[] {
    const stat = Array.from(input)
    if (stat && stat.length >= 1) {
      const flattendStat = stat.map((entry: StatDataItem) => entry.month)
      const aRange = generateDateRange(startDate.toDate(), endDate.toDate())
      for (const ele of aRange) {
        const currentMonth = getYearMonth(new Date(ele))
        if (flattendStat.indexOf(parseInt(currentMonth, 10)) === -1) {
          const newEntry: StatDataItem = {
            month: parseInt(getYearMonth(new Date(ele)), 10),
            mau: 0,
            client_credentials_access_token_count: 0,
            authz_code_access_token_count: 0,
            authz_code_idtoken_count: 0,
          }
          stat.push(newEntry)
        }
      }
      return Array.from(new Set(stat))
        .sort((a: StatDataItem, b: StatDataItem) => a.month - b.month)
        .map((item: StatDataItem) => ({
          month: item.month.toString(),
          mau: item.mau,
        }))
    }
    return stat.map((item: StatDataItem) => ({
      month: item.month.toString(),
      mau: item.mau,
    }))
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

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}>
        <Card className={applicationStyle.mainCard} type="border" color={null}>
          <CardBody>
            <Row>
              <Col sm={5}>
                <GluuLabel
                  label={t('fields.select_date_range')}
                  size="4"
                  style={{ minWidth: '200px' }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container gap={2} justifyContent="space-around">
                    <DatePicker
                      format="MM/DD/YYYY"
                      label={t('dashboard.start_date')}
                      value={startDate}
                      onChange={(date: Dayjs | null) => date && setStartDate(date)}
                    />
                    <DatePicker
                      format="MM/DD/YYYY"
                      label={t('dashboard.end_date')}
                      value={endDate}
                      onChange={(date: Dayjs | null) => date && setEndDate(date)}
                    />
                  </Grid>
                </LocalizationProvider>
              </Col>
              <Col sm={2}>
                <Button
                  style={{
                    position: 'relative',
                    top: '55px',
                    ...applicationStyle.customButtonStyle,
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
