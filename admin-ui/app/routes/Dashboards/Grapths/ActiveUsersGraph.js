import React from 'react'
import {
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'

function ActiveUsersGraph({ data }) {
  const { t } = useTranslation()
  return (
    <ResponsiveContainer className="mau" width="80%" height={350}>
      <LineChart height={400} data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line
          name={t('fields.monthly_active_users')}
          type="monotone"
          dataKey="mau"
          stroke="#8884d8"
        />
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ActiveUsersGraph
