import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Row, Col, Alert, GluuPageContent } from 'Components'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useTheme } from '@/context/theme/themeContext'
import customColors, { hexToRgb } from '@/customColors'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { SummaryCard as DashboardSummaryCard } from '@/routes/Dashboards/components'
import { useMauStyles } from './MauPage.style'
import type { Dayjs } from 'dayjs'
import { createDate, subtractDate } from '@/utils/dayjsUtils'
import { useMauStats } from './hooks'
import { DEFAULT_DATE_RANGE_MONTHS } from './constants'
import type { MauDateRange } from './types'
import {
  DateRangeSelector,
  MauSummaryCards,
  MauTrendChart,
  TokenDistributionChart,
  TokenTrendChart,
} from './components'

const MauPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.mau_dashboard'))
  const { state: themeState } = useTheme()
  const currentTheme = themeState?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK

  const dashboardThemeColors = useMemo(() => {
    const baseColors = isDark
      ? {
          cardBg: customColors.darkCardBg,
          cardBorder: `rgba(${hexToRgb(customColors.darkBorderGradientBase)}, 0.2)`,
          text: customColors.white,
          textSecondary: customColors.textMutedDark,
        }
      : {
          cardBg: customColors.white,
          cardBorder: customColors.lightBorder,
          text: customColors.primaryDark,
          textSecondary: customColors.textSecondary,
        }

    return {
      ...baseColors,
      statusCardBg: baseColors.cardBg,
      statusCardBorder: baseColors.cardBorder,
    }
  }, [isDark])
  const { classes: mauClasses } = useMauStyles({
    themeColors: { cardBg: dashboardThemeColors.cardBg, text: dashboardThemeColors.text },
    isDark,
  })

  const [startDate, setStartDate] = useState<Dayjs>(() =>
    subtractDate(createDate(), DEFAULT_DATE_RANGE_MONTHS, 'months'),
  )
  const [endDate, setEndDate] = useState<Dayjs>(() => createDate())
  const [selectedPreset, setSelectedPreset] = useState<number | null>(DEFAULT_DATE_RANGE_MONTHS)

  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const mauResourceId = ADMIN_UI_RESOURCES.MAU
  const mauScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[mauResourceId], [mauResourceId])

  const canViewMau = useMemo(
    () => hasCedarReadPermission(mauResourceId),
    [hasCedarReadPermission, mauResourceId],
  )

  useEffect(() => {
    authorizeHelper(mauScopes)
  }, [authorizeHelper, mauScopes])

  const dateRange: MauDateRange = useMemo(() => ({ startDate, endDate }), [startDate, endDate])

  const {
    data: mauData,
    summary,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useMauStats(dateRange, { enabled: canViewMau })

  const loading = isLoading || isFetching

  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    if (date) {
      setStartDate(date)
      setSelectedPreset(null)
    }
  }, [])

  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    if (date) {
      setEndDate(date)
      setSelectedPreset(null)
    }
  }, [])

  const handlePresetSelect = useCallback((months: number) => {
    setStartDate(subtractDate(createDate(), months, 'months'))
    setEndDate(createDate())
    setSelectedPreset(months)
  }, [])

  const handleApply = useCallback(() => {
    if (canViewMau) refetch()
  }, [canViewMau, refetch])

  const hasData = mauData.length > 0

  const summaryCards = useMemo(
    () => [
      { text: t('fields.total_mau'), value: summary.totalMau },
      { text: t('fields.total_tokens'), value: summary.totalTokens },
      { text: t('fields.cc_tokens'), value: summary.clientCredentialsTokens },
      { text: t('fields.authz_code_tokens'), value: summary.authCodeTokens },
    ],
    [summary, t],
  )

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper canShow={canViewMau}>
        <GluuPageContent>
          <div style={{ marginBottom: 24 }}>
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              selectedPreset={selectedPreset}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onPresetSelect={handlePresetSelect}
              onApply={handleApply}
              isLoading={loading}
            />
          </div>

          {isError && (
            <Alert color="danger" className="mb-4">
              <i className="fa fa-exclamation-triangle me-2"></i>
              {t('messages.error_loading_data')}
            </Alert>
          )}

          {!isLoading && !isError && !hasData && (
            <Alert color="info" className="mb-4">
              <i className="fa fa-info-circle me-2"></i>
              {t('messages.no_mau_data')}
            </Alert>
          )}

          {hasData && (
            <>
              <Row className="mb-4">
                <Col xs={12}>
                  <Row>
                    {summaryCards.map((card) => (
                      <Col key={card.text} xs={12} sm={6} md={3} className="mb-3 mb-md-0">
                        <DashboardSummaryCard
                          text={card.text}
                          value={card.value}
                          classes={mauClasses}
                        />
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>

              <MauTrendChart data={mauData} />

              <Row>
                <Col xs={12} lg={5} className="mb-4 mb-lg-0">
                  <TokenDistributionChart summary={summary} />
                </Col>
                <Col xs={12} lg={7}>
                  <TokenTrendChart data={mauData} />
                </Col>
              </Row>
            </>
          )}
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default MauPage
