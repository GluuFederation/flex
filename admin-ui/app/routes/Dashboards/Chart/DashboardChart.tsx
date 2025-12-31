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
import moment from 'moment'
import customColors from '@/customColors'
import type { DashboardChartProps, MauStatEntry } from '../types'

const DashboardChart = ({ statData, startMonth, endMonth }: DashboardChartProps) => {
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
    const prepareStat: MauStatEntry[] = []

    while (current.isSameOrBefore(dateEnd, 'month')) {
      const monthNum = parseInt(current.format('YYYYMM'), 10)
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
      current = current.clone().add(1, 'month')
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
