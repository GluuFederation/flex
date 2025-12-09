import React, { useMemo } from 'react'
import { Card, CardBody, CardHeader } from 'Components'
import {
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'Context/theme/themeContext'
import type { MauChartProps } from '../types'
import { getChartColors } from '../constants'
import { formatMonth, formatNumber } from '../utils'

const MauTrendChart: React.FC<MauChartProps> = ({ data }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const chartColors = useMemo(() => getChartColors(state.theme), [state.theme])

  const chartData = data.map((entry) => ({
    ...entry,
    monthLabel: formatMonth(entry.month),
  }))

  return (
    <Card className="mb-4">
      <CardHeader tag="h6">{t('titles.mau_trend')}</CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatNumber} />
            <Tooltip
              formatter={(value: number) => [formatNumber(value), t('fields.monthly_active_users')]}
              labelFormatter={(label) => label}
            />
            <Line
              type="monotone"
              dataKey="mau"
              stroke={chartColors.mau}
              strokeWidth={2}
              dot={{ fill: chartColors.mau, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export default MauTrendChart
