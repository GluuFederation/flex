import React, { useState, useMemo, useCallback } from 'react'
import { Container, Card, CardBody, Row, Col, Alert } from 'Components'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import dayjs, { type Dayjs } from 'dayjs'
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

  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs().subtract(DEFAULT_DATE_RANGE_MONTHS, 'months'),
  )
  const [endDate, setEndDate] = useState<Dayjs>(dayjs())
  const [selectedPreset, setSelectedPreset] = useState<number | null>(DEFAULT_DATE_RANGE_MONTHS)

  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const mauResourceId = ADMIN_UI_RESOURCES.MAU
  const mauScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[mauResourceId], [mauResourceId])

  const canViewMau = useMemo(
    () => hasCedarReadPermission(mauResourceId),
    [hasCedarReadPermission, mauResourceId],
  )

  React.useEffect(() => {
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
    setStartDate(dayjs().subtract(months, 'months'))
    setEndDate(dayjs())
    setSelectedPreset(months)
  }, [])

  const handleApply = useCallback(() => {
    if (canViewMau) refetch()
  }, [canViewMau, refetch])

  const hasData = mauData.length > 0

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper canShow={canViewMau}>
        <Container fluid>
          <Card className="mb-4">
            <CardBody>
              <Row className="mb-4 align-items-center">
                <Col>
                  <h4 className="mb-0">{t('titles.mau_dashboard')}</h4>
                </Col>
              </Row>

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
            </CardBody>
          </Card>

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
              <MauSummaryCards summary={summary} />

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
        </Container>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default MauPage
