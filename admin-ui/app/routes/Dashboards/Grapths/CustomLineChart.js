import React from 'react'
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts'
function CustomLineChart({ data }) {
  return (
    <ResponsiveContainer className="bar" width="100%" height={400}>
      <LineChart width={400} height={400} data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line
          name="Client credentials access token"
          type="monotone"
          dataKey="client_credentials_access_token_count"
          stroke="#8884d8"
        />
        <Line
          name="Authorization code access token"
          type="monotone"
          dataKey="authz_code_access_token_count"
          stroke="#82ca9d"
        />
        <Line
          name="Authorization code id token"
          type="monotone"
          dataKey="authz_code_idtoken_count"
          stroke="#00C9FF"
        />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default CustomLineChart
