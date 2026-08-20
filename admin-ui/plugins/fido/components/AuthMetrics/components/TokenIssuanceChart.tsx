import React, { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useChartTheme } from '@/hooks/useChartTheme'
import { RECHARTS_INITIAL_DIMENSION } from '../../Metrics/constants'
import { buildCountAxis } from '../../SecurityMonitor/utils'
import SecurityChartCard from '../../SecurityMonitor/components/SecurityChartCard'
import { SERIES_KEYS } from '../hooks'
import { AXIS_KEYS, SPARSE_SERIES_MAX_POINTS } from '../constants'
import { getSeriesColors } from '../utils'
import { useAuthMetricsStyles } from '../AuthMetricsPage.style'
import type { MetricChartRow } from '../types'

type TokenIssuanceChartProps = {
  rows: MetricChartRow[]
}

const TokenIssuanceChart: React.FC<TokenIssuanceChartProps> = ({ rows }) => {
  const { t } = useTranslation()
  const { themeColors, isDark, gridProps, axisTick, renderTooltip } = useChartTheme()
  const { classes } = useAuthMetricsStyles({ isDark, themeColors })
  const palette = useMemo(() => getSeriesColors(themeColors), [themeColors])

  const series = useMemo(
    () => [
      {
        key: SERIES_KEYS.ACCESS_TOKEN,
        label: t('fields.access_tokens'),
        color: palette.accessToken,
      },
      { key: SERIES_KEYS.ID_TOKEN, label: t('fields.id_tokens'), color: palette.idToken },
      {
        key: SERIES_KEYS.REFRESH_TOKEN,
        label: t('fields.refresh_tokens'),
        color: palette.refreshToken,
      },
      {
        key: SERIES_KEYS.AUTHORIZATION_CODE,
        label: t('fields.authorization_codes'),
        color: palette.authorizationCode,
      },
    ],
    [t, palette],
  )

  const countAxis = useMemo(
    () =>
      buildCountAxis(
        rows.reduce(
          (max, row) => Math.max(max, ...series.map((entry) => Number(row[entry.key] ?? 0))),
          0,
        ),
      ),
    [rows, series],
  )

  const isEmpty = rows.length === 0

  // A coarse bucket can leave a handful of points, and ALL leaves exactly one. An unmarked lone
  // point draws nothing at all, so markers come back once the series is sparse enough to need them.
  const dot = rows.length <= SPARSE_SERIES_MAX_POINTS && { r: 3 }

  return (
    <SecurityChartCard
      title={t('titles.token_issuance')}
      subtitle={t('fields.token_issuance_subtitle')}
      legend={series.map((entry) => ({ label: entry.label, color: entry.color }))}
      isEmpty={isEmpty}
      emptyLabel={t('fields.no_data')}
    >
      <div className={classes.chartCanvas}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <LineChart data={rows} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis
              dataKey={AXIS_KEYS.LABEL}
              tick={axisTick}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={axisTick}
              allowDecimals={false}
              domain={countAxis.domain}
              ticks={countAxis.ticks}
            />
            {isEmpty ? null : <Tooltip content={renderTooltip} />}
            {series.map((entry) => (
              <Line
                key={entry.key}
                type="monotone"
                dataKey={entry.key}
                name={entry.label}
                stroke={entry.color}
                dot={dot}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SecurityChartCard>
  )
}

export default React.memo(TokenIssuanceChart)
