import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

function CustomPieGraph({ data }) {
  return (
    <ResponsiveContainer width={400} height={400}>
      <BarChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="cc_at" fill="#00C9FF" />
        <Bar dataKey="ac_at" fill="#82ca9d" />
        <Bar dataKey="ac_id" fill="#92FE9D" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default CustomPieGraph
