import React, { useMemo } from 'react'
import {
  XAxis,
  YAxis,
  Bar,
  BarChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import './styles.css'
import TooltipDesign from './TooltipDesign'
import customColors from '@/customColors'
import { createDate, addDate, isSameOrBeforeDate } from '@/utils/dayjsUtils'
import type { DashboardChartProps, MauStatEntry } from '../types'

const DashboardChart = ({ statData, startMonth, endMonth }: DashboardChartProps) => {
  const augmentedData = useMemo(() => {
    if (!statData) {
      return []
    }

    const start = createDate(String(startMonth), 'YYYYMM')
    const end = createDate(String(endMonth), 'YYYYMM')

    if (!start.isValid() || !end.isValid()) {
      return []
    }

    if (!isSameOrBeforeDate(start, end, 'month')) {
      return []
    }

    const byMonth = new Map<number, MauStatEntry>()
    statData.forEach((entry) => byMonth.set(entry.month, entry))
    const prepareStat: MauStatEntry[] = []

    let current = start
    while (isSameOrBeforeDate(current, end, 'month')) {
      const monthNum = Number(current.format('YYYYMM'))
      const available = byMonth.get(monthNum)

      if (available) {
        prepareStat.push(available)
      } else {
        prepareStat.push({
          month: monthNum,
          mau: 0,
          client_credentials_access_token_count: 0,
          authz_code_access_token_count: 0,
          authz_code_idtoken_count: 0,
        })
      }
      current = addDate(current, 1, 'month')
    }

    return prepareStat
  }, [statData, startMonth, endMonth])

  return (
    <ResponsiveContainer debounce={300} width="100%" height="100%">
      <BarChart data={augmentedData} margin={{ top: 5, right: 30, bottom: 5 }} height={400}>
        <XAxis dataKey={'month'} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<TooltipDesign />} />
        <Legend wrapperStyle={{ color: customColors.white }} />
        <Bar dataKey="client_credentials_access_token_count" fill={customColors.orange} />
        <Bar dataKey="authz_code_access_token_count" fill={customColors.lightBlue} />
        <Bar dataKey="authz_code_idtoken_count" fill={customColors.accentRed} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default DashboardChart
