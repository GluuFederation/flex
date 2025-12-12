import React, { useMemo } from 'react'
import { Card, CardBody, CardHeader } from 'Components'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'Context/theme/themeContext'
import type { MauSummary } from '../types'
import { getChartColors } from '../constants'
import { formatNumber } from '../utils'

interface TokenDistributionChartProps {
  summary: MauSummary
}

const TokenDistributionChart: React.FC<TokenDistributionChartProps> = ({ summary }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const chartColors = useMemo(() => getChartColors(state.theme), [state.theme])

  const data = useMemo(
    () => [
      {
        name: t('fields.cc_tokens'),
        value: summary.clientCredentialsTokens,
        color: chartColors.clientCredentials,
      },
      {
        name: t('fields.authz_code_tokens'),
        value: summary.authCodeTokens,
        color: chartColors.authCodeAccess,
      },
    ],
    [summary, t, chartColors],
  )

  const hasData = summary.totalTokens > 0

  return (
    <Card className="h-100">
      <CardHeader tag="h6">{t('titles.token_distribution')}</CardHeader>
      <CardBody>
        {hasData ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="d-flex align-items-center justify-content-center" style={{ height: 250 }}>
            <span className="text-muted">{t('messages.no_mau_data')}</span>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default TokenDistributionChart
