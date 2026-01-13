import React, { useMemo, memo } from 'react'
import moment from 'moment'
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
import type { DashboardChartProps, MauStatEntry } from '../types'
import './styles.css'

const DashboardChart = memo(
  ({ statData, startMonth, endMonth, textColor, gridColor }: DashboardChartProps) => {
    const augmentedData = useMemo(() => {
      if (!statData) {
        return []
      }

      const dateStart = moment(startMonth, 'YYYYMM')
      const dateEnd = moment(endMonth, 'YYYYMM')

      if (dateStart.isAfter(dateEnd, 'month')) {
        return []
      }

      let current = dateStart.clone()
      const byMonth = new Map<number, MauStatEntry>()
      statData.forEach((entry) => byMonth.set(entry.month, entry))
      const prepareStat: Array<MauStatEntry & { monthLabel: string }> = []

      while (current.isSameOrBefore(dateEnd, 'month')) {
        const monthNum = parseInt(current.format('YYYYMM'), 10)
        const available = byMonth.get(monthNum)

        if (available) {
          prepareStat.push({
            ...available,
            monthLabel: current.format('YYYY MM'),
          })
        } else {
          prepareStat.push({
            month: monthNum,
            mau: 0,
            client_credentials_access_token_count: 0,
            authz_code_access_token_count: 0,
            authz_code_idtoken_count: 0,
            monthLabel: current.format('YYYY MM'),
          })
        }
        current = current.clone().add(1, 'month')
      }

      return prepareStat
    }, [statData, startMonth, endMonth])

    const maxValue = useMemo(() => {
      if (augmentedData.length === 0) return 1200

      const max = augmentedData.reduce((acc, entry) => {
        const total =
          (entry.authz_code_idtoken_count || 0) +
          (entry.authz_code_access_token_count || 0) +
          (entry.client_credentials_access_token_count || 0)
        return Math.max(acc, total)
      }, 0)

      const tickInterval = 300
      return Math.ceil(max / tickInterval) * tickInterval || 1200
    }, [augmentedData])

    const yAxisTicks = useMemo(() => {
      const tickInterval = 300
      const ticks: number[] = []
      for (let i = 0; i <= maxValue; i += tickInterval) {
        ticks.push(i)
      }
      return ticks
    }, [maxValue])

    return (
      <ResponsiveContainer debounce={1} width="100%" height="100%">
        <AreaChart data={augmentedData} margin={{ top: 10, right: 30, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor || customColors.textMutedDark} />
          <XAxis
            dataKey="monthLabel"
            tick={{
              fill: textColor || customColors.primaryDark,
              fontSize: parseFloat(fontSizes.chartAxis),
              fontFamily,
            }}
            style={{ color: textColor || customColors.primaryDark, fontFamily }}
          />
          <YAxis
            tick={{
              fill: textColor || customColors.primaryDark,
              fontSize: parseFloat(fontSizes.chartAxis),
              fontFamily,
            }}
            style={{ fontFamily }}
            domain={[0, maxValue]}
            ticks={yAxisTicks}
          />
          <Tooltip content={<TooltipDesign />} />
          <Area
            type="monotone"
            dataKey="authz_code_idtoken_count"
            name="Authorization Code ID Token"
            stackId="1"
            stroke={customColors.chartPurple}
            fill={customColors.chartPurple}
            fillOpacity={0.6}
            dot={{ fill: customColors.chartPurple, r: 3.5 }}
            activeDot={{ r: 5 }}
          />
          <Area
            type="monotone"
            dataKey="authz_code_access_token_count"
            name="Authorization Code Access Token"
            stackId="1"
            stroke={customColors.chartCoral}
            fill={customColors.chartCoral}
            fillOpacity={0.6}
            dot={{ fill: customColors.chartCoral, r: 3.5 }}
            activeDot={{ r: 5 }}
          />
          <Area
            type="monotone"
            dataKey="client_credentials_access_token_count"
            name="Client Credential Access Token"
            stackId="1"
            stroke={customColors.chartCyan}
            fill={customColors.chartCyan}
            fillOpacity={0.6}
            dot={{ fill: customColors.chartCyan, r: 3.5 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  },
)

DashboardChart.displayName = 'DashboardChart'

export default DashboardChart
