import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

function ActiveUserStatPanel({ data }) {
  return (
    <BarChart
      width={900}
      height={400}
      data={data}
      margin={{
        top: 5,
        right: 5,
        left: 60,
        bottom: 5,
      }}
    >
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="monthly_active_users"
        fill="#009624"
        background={{ fill: '#eee' }}
      />
      <Bar dataKey="monthly_refresh_token_refresh_token" fill="#88ffff" />
      <Bar dataKey="monthly_password_refresh_token" fill="#000051" />
      <Bar dataKey="monthly_implicit_refresh_token" fill="#ffc4ff" />
    </BarChart>
  )
}

export default ActiveUserStatPanel
