import React, { useState, useEffect, useContext, lazy, Suspense, useMemo } from 'react'
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
import { buildPayload } from 'Utils/PermChecker'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import dayjs from 'dayjs'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

const ActiveUsersGraph = lazy(() => import('Routes/Dashboards/Grapths/ActiveUsersGraph'))

function MauGraph() {
  const dispatch = useDispatch()
  const statData = useSelector((state) => state.mauReducer.stat)
  const loading = useSelector((state) => state.mauReducer.loading)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [startDate, setStartDate] = useState(dayjs().subtract(3, 'months'))
  const [endDate, setEndDate] = useState(dayjs())
  const { hasCedarPermission, authorizeHelper } = useCedarling()
  const userAction = {}
  const options = {}
  const mauResourceId = useMemo(() => ADMIN_UI_RESOURCES.MAU, [])
  const mauScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[mauResourceId], [mauResourceId])

  useEffect(() => {
    const initPermissions = async () => {
      await authorizeHelper(mauScopes)
    }

    if (!statData || statData.length === 0) {
      search()
    }
    initPermissions()
  }, [statData, authorizeHelper, mauScopes])

  const hasViewPermissions = useMemo(() => {
    return Boolean(hasCedarPermission(mauResourceId))
  }, [cedarPermissions, hasCedarPermission, mauResourceId])

  SetTitle(t('fields.monthly_active_users'))

  function search() {
    // options['month'] = getFormattedMonth()
    options['startMonth'] = getYearMonth(startDate.toDate())
    options['endMonth'] = getYearMonth(endDate.toDate())
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau({ action: userAction }))
  }

  function doDataAugmentation(input) {
    const stat = Array.from(input)
    if (stat && stat.length >= 1) {
      const flattendStat = stat.map((entry) => entry['month'])
      const aRange = generateDateRange(startDate.toDate(), endDate.toDate())
      for (const ele of aRange) {
        const currentMonth = getYearMonth(new Date(ele))
        if (flattendStat.indexOf(parseInt(currentMonth, 10)) === -1) {
          const newEntry = new Object()
          newEntry['month'] = parseInt(getYearMonth(new Date(ele)), 10)
          newEntry['mau'] = 0
          newEntry['client_credentials_access_token_count'] = 0
          newEntry['authz_code_access_token_count'] = 0
          newEntry['authz_code_idtoken_count'] = 0
          stat.push(newEntry)
        }
      }
      return Array.from(new Set(stat)).sort((a, b) => parseInt(a.month, 10) - parseInt(b.month, 10))
    }
    return stat
  }
  function getYearMonth(date) {
    return date.getFullYear() + getMonth(date)
  }
  function getMonth(aDate) {
    const value = String(aDate.getMonth() + 1)
    if (value.length > 1) {
      return value
    } else {
      return '0' + value
    }
  }

  function generateDateRange(startDate, endDate) {
    const start = moment(startDate)
    const end = moment(endDate)
    const result = []
    while (end > start || start.format('M') === end.format('M')) {
      result.push(start.format('YYYY-MM') + '-01')
      start.add(1, 'month')
    }
    return result
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper canShow={hasViewPermissions}>
        <Card style={applicationStyle.mainCard}>
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
                      id="date-picker-inline"
                      label={t('dashboard.start_date')}
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                    <DatePicker
                      format="MM/DD/YYYY"
                      id="date-picker-inline"
                      label={t('dashboard.end_date')}
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
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
