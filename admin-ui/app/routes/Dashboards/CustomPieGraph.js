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
      <BarChart
        width={400}
        height={400}
        data={data.sort(
          (a, b) => parseInt(a.month, 10) - parseInt(b.month, 10),
        )}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="client_credentials_access_token_count" fill="#00C9FF" />
        <Bar dataKey="authz_code_access_token_count" fill="#82ca9d" />
        <Bar dataKey="authz_code_idtoken_count" fill="#92FE9D" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default CustomPieGraph
