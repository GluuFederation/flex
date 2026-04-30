import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { Row, Col, GluuPageContent } from 'Components'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import { GluuButton } from '@/components/GluuButton'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import dayjs, { type Dayjs } from 'dayjs'
import { useMetricsStyles } from './MetricsPage.style'
import {
  PasskeyAuthChart,
  PasskeyAdoptionChart,
  OnboardingTimeChart,
  AggregationTab,
} from './components'
import { useAdoptionMetrics, useErrorsAnalytics, usePerformanceAnalytics } from './hooks'
import type { MetricsDateRange } from './types'

const METRICS_RESOURCE_ID = ADMIN_UI_RESOURCES.MAU
const METRICS_SCOPES = CEDAR_RESOURCE_SCOPES[METRICS_RESOURCE_ID]

const MetricsPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.passkey_metrics_dashboard'))

  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const [startDate, setStartDate] = useState<Dayjs | null>(() =>
    dayjs().startOf('month').startOf('day').millisecond(0),
  )
  const [endDate, setEndDate] = useState<Dayjs | null>(() =>
    dayjs().hour(23).minute(59).second(0).millisecond(0),
  )
  const [appliedRange, setAppliedRange] = useState<MetricsDateRange | null>(() => ({
    startDate: dayjs().startOf('month').startOf('day').millisecond(0),
    endDate: dayjs().hour(23).minute(59).second(0).millisecond(0),
  }))

  const isApplyEnabled = !!(startDate && endDate)

  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const canView = useMemo(
    () => hasCedarReadPermission(METRICS_RESOURCE_ID),
    [hasCedarReadPermission],
  )

  const { isLoading: adoptionLoading, isFetching: adoptionFetching } = useAdoptionMetrics(
    appliedRange,
    { enabled: canView },
  )
  const { isLoading: errorsLoading, isFetching: errorsFetching } = useErrorsAnalytics(
    appliedRange,
    { enabled: canView },
  )
  const { isLoading: performanceLoading, isFetching: performanceFetching } =
    usePerformanceAnalytics(appliedRange, { enabled: canView })

  const isMetricsLoading =
    adoptionLoading ||
    errorsLoading ||
    performanceLoading ||
    adoptionFetching ||
    errorsFetching ||
    performanceFetching

  useEffect(() => {
    authorizeHelper(METRICS_SCOPES)
  }, [authorizeHelper])

  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    setStartDate(date ? date.millisecond(0) : null)
  }, [])

  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    setEndDate(date ? date.millisecond(0) : null)
  }, [])

  const handleApply = useCallback(() => {
    if (!startDate || !endDate) return
    setAppliedRange({ startDate, endDate })
  }, [startDate, endDate])

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  const applyButtonColors = useMemo(
    () => ({
      backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
      textColor: themeColors.formFooter?.apply?.textColor,
    }),
    [themeColors],
  )

  const filterBar = (
    <div className={classes.filterCard}>
      <div className={classes.filterCardContent}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <GluuDatePicker
              mode="range"
              layout="row"
              labelAsTitle
              showTime
              inputHeight={52}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              startDateLabel={t('dashboard.start_date_time')}
              endDateLabel={t('dashboard.end_date_time')}
              textColor={themeColors.fontColor}
              backgroundColor={cardBg}
            />
          </div>
          <div style={{ minWidth: 120 }}>
            <GluuButton
              type="button"
              size="md"
              minHeight={52}
              block
              backgroundColor={applyButtonColors.backgroundColor}
              textColor={applyButtonColors.textColor}
              borderColor={applyButtonColors.backgroundColor}
              useOpacityOnHover
              disabled={!isApplyEnabled}
              onClick={handleApply}
            >
              {t('actions.apply')}
            </GluuButton>
          </div>
        </div>
      </div>
    </div>
  )

  const tabNames = useMemo(
    () => [t('fields.metrics_tab_general'), t('fields.metrics_tab_aggregation')],
    [t],
  )

  const tabToShow = useCallback(
    (tabName: string) => {
      switch (tabName) {
        case t('fields.metrics_tab_general'):
          return (
            <>
              {filterBar}
              <Row className="mb-4">
                <Col xs={12} lg={6} className="mb-4 mb-lg-0">
                  <PasskeyAuthChart dateRange={appliedRange} />
                </Col>
                <Col xs={12} lg={6}>
                  <PasskeyAdoptionChart dateRange={appliedRange} />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <OnboardingTimeChart dateRange={appliedRange} />
                </Col>
              </Row>
            </>
          )
        case t('fields.metrics_tab_aggregation'):
          return <AggregationTab />
        default:
          return null
      }
    },
    [t, filterBar, appliedRange],
  )

  return (
    <GluuLoader blocking={isMetricsLoading}>
      <GluuViewWrapper canShow={canView}>
        <GluuPageContent withVerticalPadding={false}>
          <GluuTabs tabNames={tabNames} tabToShow={tabToShow} />
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default MetricsPage
