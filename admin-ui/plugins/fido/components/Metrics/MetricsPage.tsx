import React, { useMemo, useCallback, useState } from 'react'
import { Row, Col, GluuPageContent } from 'Components'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@mui/material/useMediaQuery'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import { GluuButton } from '@/components/GluuButton'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { FILTER_SHEET, MEDIA_QUERY_OPTIONS, MOBILE_MEDIA_QUERY, OPACITY } from '@/constants'
import { FilterListIcon } from '@/components/icons'
import MobileNavSheet from '@/components/MobileBottomNav/MobileNavSheet'
import { SHEET_KEYS } from '@/components/MobileBottomNav/sheetConstants'
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

const METRICS_RESOURCE_ID = ADMIN_UI_RESOURCES.FIDO

const MetricsPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.passkey_metrics_dashboard'))

  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)

  const [startDate, setStartDate] = useState<Dayjs | null>(() =>
    dayjs().startOf('month').startOf('day').millisecond(0),
  )
  const [endDate, setEndDate] = useState<Dayjs | null>(() =>
    dayjs().hour(23).minute(59).second(0).millisecond(0),
  )
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [appliedRange, setAppliedRange] = useState<MetricsDateRange | null>(() => ({
    startDate: dayjs().startOf('month').startOf('day').millisecond(0),
    endDate: dayjs().hour(23).minute(59).second(0).millisecond(0),
  }))

  const isApplyEnabled = !!(startDate && endDate && !endDate.isBefore(startDate))

  const { canRead: canView } = usePermission(METRICS_RESOURCE_ID)

  const { isLoading: adoptionLoading, isFetching: adoptionFetching } =
    useAdoptionMetrics(appliedRange)
  const { isLoading: errorsLoading, isFetching: errorsFetching } = useErrorsAnalytics(appliedRange)
  const { isLoading: performanceLoading, isFetching: performanceFetching } =
    usePerformanceAnalytics(appliedRange)

  const isMetricsLoading =
    adoptionLoading ||
    errorsLoading ||
    performanceLoading ||
    adoptionFetching ||
    errorsFetching ||
    performanceFetching

  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    setStartDate(date ? date.millisecond(0) : null)
  }, [])

  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    setEndDate(date ? date.millisecond(0) : null)
  }, [])

  const handleApply = useCallback(() => {
    if (!startDate || !endDate || endDate.isBefore(startDate)) return
    setAppliedRange({ startDate, endDate })
    setFilterSheetOpen(false)
  }, [startDate, endDate])

  const openFilterSheet = useCallback(() => setFilterSheetOpen(true), [])

  const closeFilterSheet = useCallback(() => setFilterSheetOpen(false), [])

  const handleFilterCancel = useCallback(() => {
    setStartDate(appliedRange?.startDate ?? null)
    setEndDate(appliedRange?.endDate ?? null)
    setFilterSheetOpen(false)
  }, [appliedRange])

  const handleTabChange = useCallback(() => setFilterSheetOpen(false), [])

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  const applyButtonColors = useMemo(
    () => ({
      backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
      textColor: themeColors.formFooter?.apply?.textColor,
    }),
    [themeColors],
  )

  const sheetCancelColors = useMemo(
    () => ({
      textColor: themeColors.formFooter?.cancel?.textColor ?? themeColors.fontColor,
      borderColor: themeColors.formFooter?.cancel?.borderColor ?? themeColors.borderColor,
    }),
    [themeColors],
  )

  const sheetApplyColors = useMemo(
    () => ({
      backgroundColor: themeColors.badges?.filledBadgeBg ?? themeColors.fontColor,
      textColor: themeColors.badges?.filledBadgeText ?? themeColors.background,
    }),
    [themeColors],
  )

  const dateFields = (
    <div className={classes.filterDateField}>
      <GluuDatePicker
        mode="range"
        layout={isMobile ? 'grid' : 'row'}
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
  )

  const filterBar = isMobile ? (
    <MobileNavSheet
      openKey={filterSheetOpen ? SHEET_KEYS.CUSTOM : null}
      onClose={handleFilterCancel}
      title={t('titles.filters')}
    >
      <div className={classes.filterSheetContent}>
        {dateFields}
        <div className={classes.filterSheetButtonRow}>
          <GluuButton
            type="button"
            size="md"
            block
            outlined
            onClick={handleFilterCancel}
            textColor={sheetCancelColors.textColor}
            borderColor={sheetCancelColors.borderColor}
            borderRadius={FILTER_SHEET.BUTTON_RADIUS}
            minHeight={FILTER_SHEET.BUTTON_HEIGHT}
            fontWeight={700}
          >
            {t('actions.cancel')}
          </GluuButton>
          <GluuButton
            type="button"
            size="md"
            block
            onClick={handleApply}
            disabled={!isApplyEnabled}
            backgroundColor={sheetApplyColors.backgroundColor}
            textColor={sheetApplyColors.textColor}
            borderColor={sheetApplyColors.backgroundColor}
            borderRadius={FILTER_SHEET.BUTTON_RADIUS}
            minHeight={FILTER_SHEET.BUTTON_HEIGHT}
            fontWeight={700}
            useOpacityOnHover
            hoverOpacity={OPACITY.OVERLAY}
          >
            {t('actions.apply')}
          </GluuButton>
        </div>
      </div>
    </MobileNavSheet>
  ) : (
    <div className={classes.filterCard}>
      <div className={classes.filterCardContent}>
        <div className={classes.filterRow}>
          {dateFields}
          <div className={classes.filterActionField}>
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
              <Row className={`mb-4 ${classes.chartRow}`}>
                <Col xs={12} className={classes.generalChartCol}>
                  <PasskeyAuthChart dateRange={appliedRange} />
                </Col>
                <Col xs={12} className={classes.generalChartCol}>
                  <PasskeyAdoptionChart dateRange={appliedRange} />
                </Col>
              </Row>
              <Row className={classes.chartRow}>
                <Col xs={12}>
                  <OnboardingTimeChart dateRange={appliedRange} />
                </Col>
              </Row>
            </>
          )
        case t('fields.metrics_tab_aggregation'):
          return (
            <AggregationTab
              filterSheetOpen={filterSheetOpen}
              onFilterSheetClose={closeFilterSheet}
            />
          )
        default:
          return null
      }
    },
    [
      t,
      filterBar,
      appliedRange,
      classes.generalChartCol,
      classes.chartRow,
      filterSheetOpen,
      closeFilterSheet,
    ],
  )

  const filterTrigger = isMobile ? (
    <button
      type="button"
      aria-label={t('titles.filters')}
      aria-haspopup="dialog"
      aria-expanded={filterSheetOpen}
      className={classes.mobileFilterTrigger}
      onClick={openFilterSheet}
    >
      <FilterListIcon />
    </button>
  ) : undefined

  return (
    <GluuLoader blocking={isMetricsLoading}>
      <GluuViewWrapper canShow={canView}>
        <GluuPageContent withVerticalPadding={false}>
          <GluuTabs
            tabNames={tabNames}
            tabToShow={tabToShow}
            rightAction={filterTrigger}
            onTabChange={handleTabChange}
          />
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default MetricsPage
