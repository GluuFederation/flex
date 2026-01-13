import React, { useMemo, memo } from 'react'
import {
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import './styles.css'
import TooltipDesign from './TooltipDesign'
import moment from 'moment'
import customColors from '@/customColors'
import { fontFamily, fontSizes } from '@/styles/fonts'
import type { DashboardChartProps, MauStatEntry } from '../types'

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
            domain={[0, 1200]}
            ticks={[0, 300, 600, 900, 1200]}
          />
          <Tooltip content={<TooltipDesign />} />
          <Legend wrapperStyle={{ display: 'none' }} />
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
