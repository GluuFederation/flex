import React, { useMemo } from 'react'
import { Card, CardBody, Row, Col } from 'Components'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import customColors from '@/customColors'
import type { MauSummary } from '../types'
import { getChartColors } from '../constants'
import { formatNumber, formatPercentChange } from '../utils'

interface MauSummaryCardsProps {
  summary: MauSummary
}

interface SummaryCardProps {
  title: string
  value: number
  change?: number
  color: string
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, change, color }) => {
  const { t } = useTranslation()
  const showChange = change !== undefined
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const changeColor = isPositive
    ? customColors.statusActive
    : isNegative
      ? customColors.statusInactive
      : customColors.textSecondary
  const changeIcon = isPositive ? 'fa-arrow-up' : isNegative ? 'fa-arrow-down' : 'fa-minus'

  return (
    <Card className="h-100" style={{ borderTop: `3px solid ${color}` }}>
      <CardBody className="text-center">
        <GluuText variant="h6" secondary className="mb-2 d-block">
          {title}
        </GluuText>
        <GluuText variant="h3" className="mb-2 d-block">
          {formatNumber(value)}
        </GluuText>
        {showChange && (
          <div style={{ color: changeColor, fontSize: '0.875rem' }}>
            <i className={`fa ${changeIcon} me-1`} />
            {formatPercentChange(change)}
            <GluuText variant="span" secondary className="ms-1">
              {t('messages.vs_previous_period')}
            </GluuText>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

const MauSummaryCards: React.FC<MauSummaryCardsProps> = ({ summary }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const chartColors = useMemo(() => getChartColors(state.theme), [state.theme])

  const cards = [
    {
      title: t('fields.total_mau'),
      value: summary.totalMau,
      change: summary.mauChange,
      color: chartColors.mau,
    },
    {
      title: t('fields.total_tokens'),
      value: summary.totalTokens,
      change: summary.tokenChange,
      color: customColors.textSecondary,
    },
    {
      title: t('fields.cc_tokens'),
      value: summary.clientCredentialsTokens,
      color: chartColors.pieClientCredentials,
    },
    {
      title: t('fields.authz_code_tokens'),
      value: summary.authCodeTokens,
      color: chartColors.pieAuthCodeAccess,
    },
  ]

  return (
    <Row className="mb-4">
      {cards.map((card, index) => (
        <Col key={index} xs={12} sm={6} lg={3} className="mb-3 mb-lg-0">
          <SummaryCard
            title={card.title}
            value={card.value}
            change={card.change}
            color={card.color}
          />
        </Col>
      ))}
    </Row>
  )
}

export default MauSummaryCards
