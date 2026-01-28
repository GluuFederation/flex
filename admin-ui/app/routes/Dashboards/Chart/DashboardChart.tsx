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
import type { DashboardChartProps, MauStatEntry } from '../types'

const DashboardChart = ({ statData, startMonth, endMonth }: DashboardChartProps) => {
  const augmentedData = useMemo(() => {
    if (!statData) {
      return []
    }

    const parseYearMonth = (value: number | string) => {
      const s = String(value)
      if (s.length !== 6) {
        return null
      }
      const year = Number(s.slice(0, 4))
      const month = Number(s.slice(4, 6))
      if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
        return null
      }
      return { year, month }
    }

    const start = parseYearMonth(startMonth)
    const end = parseYearMonth(endMonth)

    if (!start || !end) {
      return []
    }

    const startIndex = start.year * 12 + (start.month - 1)
    const endIndex = end.year * 12 + (end.month - 1)

    if (startIndex > endIndex) {
      return []
    }

    const byMonth = new Map<number, MauStatEntry>()
    statData.forEach((entry) => byMonth.set(entry.month, entry))
    const prepareStat: MauStatEntry[] = []

    for (let idx = startIndex; idx <= endIndex; idx += 1) {
      const year = Math.floor(idx / 12)
      const month = (idx % 12) + 1
      const monthNum = year * 100 + month
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
