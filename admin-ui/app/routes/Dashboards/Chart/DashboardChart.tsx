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
import type { MauStatEntry } from 'Plugins/admin/components/MAU/types'

interface DashboardChartProps {
  statData: MauStatEntry[]
  startMonth?: string
  endMonth?: string
}

const DashboardChart = ({ statData, startMonth, endMonth }: DashboardChartProps) => {
  const augmentedData = useMemo(() => {
    if (!startMonth || !endMonth || !statData) {
      return statData ?? []
    }

    const dateStart = moment(startMonth, 'YYYYMM')
    const dateEnd = moment(endMonth, 'YYYYMM')
    const prepareStat: MauStatEntry[] = []

    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
      const monthNum = parseInt(dateStart.format('YYYYMM'), 10)
      const available = statData.filter((obj) => obj.month === monthNum)

      if (available.length) {
        prepareStat.push(available[0])
      } else {
        prepareStat.push({
          month: monthNum,
          mau: 0,
          client_credentials_access_token_count: 0,
          authz_code_access_token_count: 0,
          authz_code_idtoken_count: 0,
        })
      }
      dateStart.add(1, 'month')
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
