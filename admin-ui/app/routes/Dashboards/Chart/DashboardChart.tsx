import React, { useMemo, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { GlobalStyles } from '@mui/material'
import {
  createDate,
  formatDate,
  addDate,
  isAfterDate,
  isSameOrBeforeDate,
} from '@/utils/dayjsUtils'
import {
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import customColors from '@/customColors'
import { fontFamily, fontSizes } from '@/styles/fonts'
import TooltipDesign from './TooltipDesign'
import { chartGlobalStyles } from './DashboardChart.style'
import type { DashboardChartProps, MauStatEntry } from '../types'
import { CHART_CONSTANTS, CHART_LEGEND_CONFIG } from '../constants'

const DashboardChart = memo(
  ({
    statData,
    startMonth,
    endMonth,
    textColor,
    gridColor,
    tooltipBackgroundColor,
    tooltipTextColor,
    isDark = false,
  }: DashboardChartProps) => {
    const { t } = useTranslation()

    const augmentedData = useMemo(() => {
      if (!statData) {
        return []
      }

      const dateStart = createDate(startMonth, 'YYYYMM')
      const dateEnd = createDate(endMonth, 'YYYYMM')

      if (isAfterDate(dateStart, dateEnd, 'month')) {
        return []
      }

      let current = dateStart
      const byMonth = new Map<number, MauStatEntry>()
      statData.forEach((entry) => byMonth.set(entry.month, entry))
      const prepareStat: Array<MauStatEntry & { monthLabel: string }> = []

      while (isSameOrBeforeDate(current, dateEnd, 'month')) {
        const monthNum = parseInt(formatDate(current, 'YYYYMM'), 10)
        const available = byMonth.get(monthNum)

        if (available) {
          prepareStat.push({
            ...available,
            monthLabel: formatDate(current, 'YYYY MM'),
          })
        } else {
          prepareStat.push({
            month: monthNum,
            mau: 0,
            client_credentials_access_token_count: 0,
            authz_code_access_token_count: 0,
            authz_code_idtoken_count: 0,
            monthLabel: formatDate(current, 'YYYY MM'),
          })
        }
        current = addDate(current, 1, 'month')
      }

      return prepareStat
    }, [statData, startMonth, endMonth])

    const maxValue = useMemo(() => {
      if (augmentedData.length === 0) return CHART_CONSTANTS.MIN_MAX

      const max = augmentedData.reduce((acc, entry) => {
        const total =
          (entry.authz_code_idtoken_count || 0) +
          (entry.authz_code_access_token_count || 0) +
          (entry.client_credentials_access_token_count || 0)
        return Math.max(acc, total)
      }, 0)

      const calculatedMaxRounded =
        Math.ceil(max / CHART_CONSTANTS.TICK_INTERVAL) * CHART_CONSTANTS.TICK_INTERVAL
      return Math.max(calculatedMaxRounded, CHART_CONSTANTS.MIN_MAX)
    }, [augmentedData])

    const yAxisTicks = useMemo(() => {
      const ticks: number[] = []
      const effectiveMaxValue = Math.max(maxValue, CHART_CONSTANTS.TICK_INTERVAL)
      for (let i = 0; i <= effectiveMaxValue; i += CHART_CONSTANTS.TICK_INTERVAL) {
        ticks.push(i)
      }
      return ticks
    }, [maxValue])

    const axisTickStyle = useMemo(
      () => ({
        fill: textColor || customColors.primaryDark,
        fontSize: parseFloat(fontSizes.chartAxis),
        fontFamily,
      }),
      [textColor],
    )

    return (
      <>
        <GlobalStyles styles={chartGlobalStyles} />
        <ResponsiveContainer debounce={1} width="100%" height="100%">
          <AreaChart data={augmentedData} margin={CHART_CONSTANTS.MARGIN}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor || customColors.textMutedDark} />
            <XAxis
              dataKey="monthLabel"
              tick={axisTickStyle}
              style={{ color: textColor || customColors.primaryDark, fontFamily }}
            />
            <YAxis
              tick={axisTickStyle}
              style={{ fontFamily }}
              domain={[0, maxValue]}
              ticks={yAxisTicks}
            />
            <Tooltip
              content={
                <TooltipDesign
                  backgroundColor={tooltipBackgroundColor}
                  textColor={tooltipTextColor}
                  isDark={isDark}
                />
              }
            />
            {CHART_LEGEND_CONFIG.map((config) => (
              <Area
                key={config.dataKey}
                type="monotone"
                dataKey={config.dataKey}
                name={t(config.translationKey)}
                stackId="1"
                stroke={config.color}
                fill={config.color}
                fillOpacity={CHART_CONSTANTS.FILL_OPACITY}
                dot={{ fill: config.color, r: CHART_CONSTANTS.DOT_RADIUS }}
                activeDot={{ r: CHART_CONSTANTS.ACTIVE_DOT_RADIUS }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </>
    )
  },
)

DashboardChart.displayName = 'DashboardChart'

export default DashboardChart
