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
import { createDate, subtractDate } from '@/utils/dayjsUtils'
import type { Dayjs } from 'dayjs'
import { useMetricsStyles } from './MetricsPage.style'
import {
  PasskeyAuthChart,
  PasskeyAdoptionChart,
  OnboardingTimeChart,
  AggregationTab,
} from './components'

const METRICS_RESOURCE_ID = ADMIN_UI_RESOURCES.MAU
const METRICS_SCOPES = CEDAR_RESOURCE_SCOPES[METRICS_RESOURCE_ID]

const MetricsPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.passkey_metrics_dashboard'))

  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const [startDate, setStartDate] = useState<Dayjs>(() => subtractDate(createDate(), 4, 'months'))
  const [endDate, setEndDate] = useState<Dayjs>(() => createDate())

  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const canView = useMemo(
    () => hasCedarReadPermission(METRICS_RESOURCE_ID),
    [hasCedarReadPermission],
  )

  useEffect(() => {
    authorizeHelper(METRICS_SCOPES)
  }, [authorizeHelper])

  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    if (date) setStartDate(date)
  }, [])

  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    if (date) setEndDate(date)
  }, [])

  const handleApply = useCallback(() => {
    // Trigger data fetch with new date range when API is available
  }, [])

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
              inputHeight={52}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              textColor={themeColors.fontColor}
              backgroundColor={cardBg}
            />
          </div>
          <GluuButton
            type="button"
            size="md"
            minHeight={52}
            backgroundColor={applyButtonColors.backgroundColor}
            textColor={applyButtonColors.textColor}
            borderColor={applyButtonColors.backgroundColor}
            useOpacityOnHover
            onClick={handleApply}
          >
            {t('actions.apply')}
          </GluuButton>
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
                  <PasskeyAuthChart />
                </Col>
                <Col xs={12} lg={6}>
                  <PasskeyAdoptionChart />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <OnboardingTimeChart />
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
    [t, filterBar],
  )

  return (
    <GluuLoader blocking={false}>
      <GluuViewWrapper canShow={canView}>
        <GluuPageContent withVerticalPadding={false}>
          <GluuTabs tabNames={tabNames} tabToShow={tabToShow} />
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default MetricsPage
