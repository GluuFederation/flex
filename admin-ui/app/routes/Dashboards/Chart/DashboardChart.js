import React from 'react'
import {
  XAxis,
  YAxis,
  Bar,
  BarChart,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import './styles.css'

const data = [
  { name: 'Sample A', height: 40 },
  { name: 'Sample B', height: 30 },
  { name: 'Sample C', height: 20 },
  { name: 'Sample D', height: 27 },
  { name: 'Sample E', height: 18 },
  { name: 'Sample F', height: 23 },
  { name: 'Sample G', height: 34 },
  { name: 'Sample G', height: 23 },
  { name: 'Sample G', height: 29 },
]

const DashboardChart = () => {
  return (
    <ResponsiveContainer width="100%" aspect={6.0 / 2.4}>
      <BarChart data={data} margin={{ top: 5, right: 30, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Legend wrapperStyle={{ color: '#fff' }} />
        <Bar dataKey="height" fill={'#4C5B66'} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default DashboardChart
