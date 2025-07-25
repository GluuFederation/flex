import React from 'react'
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
} from 'Components/recharts'

import colors from '../../../../app/colors'
import customColors from '@/customColors'

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
]

const SimpleBarChart = () => (
  <ResponsiveContainer width="100%" aspect={6.0 / 3.0}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip
        contentStyle={{
          background: colors['900'],
          border: `1px solid ${colors['900']}`,
          color: customColors.white,
        }}
      />
      <Legend wrapperStyle={{ color: colors['900'] }} />
      <Bar dataKey="pv" fill={colors['primary']} barSize={5} />
      <Bar dataKey="uv" fill={colors['purple']} barSize={5} />
    </BarChart>
  </ResponsiveContainer>
)

export { SimpleBarChart }
