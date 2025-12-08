import React, { useContext, useMemo } from 'react'
import { Card, CardBody, Row, Col } from 'Components'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import type { MauSummary } from '../types'
import { getChartColors } from '../constants'
import { formatNumber, formatPercentChange } from '../utils'

interface ThemeState {
  state: {
    theme: string
  }
}

interface MauSummaryCardsProps {
  summary: MauSummary
}

interface SummaryCardProps {
  title: string
  value: number
  change: number
  color: string
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, change, color }) => {
  const { t } = useTranslation()
  const isPositive = change >= 0
  const changeColor = isPositive ? '#28a745' : '#dc3545'
  const changeIcon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down'

  return (
    <Card className="h-100" style={{ borderTop: `3px solid ${color}` }}>
      <CardBody className="text-center">
        <h6 className="text-muted mb-2">{title}</h6>
        <h3 className="mb-2">{formatNumber(value)}</h3>
        <div style={{ color: changeColor, fontSize: '0.875rem' }}>
          <i className={`fa ${changeIcon} me-1`}></i>
          {formatPercentChange(change)}
          <span className="text-muted ms-1">{t('messages.vs_previous_period')}</span>
        </div>
      </CardBody>
    </Card>
  )
}

const MauSummaryCards: React.FC<MauSummaryCardsProps> = ({ summary }) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext) as ThemeState
  const chartColors = useMemo(() => getChartColors(theme.state.theme), [theme.state.theme])

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
      color: '#6c757d',
    },
    {
      title: t('fields.cc_tokens'),
      value: summary.clientCredentialsTokens,
      change: summary.tokenChange,
      color: chartColors.clientCredentials,
    },
    {
      title: t('fields.authz_code_tokens'),
      value: summary.authCodeTokens,
      change: summary.tokenChange,
      color: chartColors.authCodeAccess,
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
