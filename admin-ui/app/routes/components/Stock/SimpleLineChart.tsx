// @ts-nocheck
import React from 'react'
import {
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Dot,
} from 'Components/recharts'

import colors from './../../../colors'

const data = [
  { name: "Mar '11", uv: 4000, pv: 2400 },
  { name: "Dec '11", uv: 3000, pv: 1398 },
  { name: "Oct '12", uv: 2000, pv: 9800 },
  { name: "Jul '13", uv: 2780, pv: 3908 },
  { name: "May '14", uv: 1890, pv: 4800 },
  { name: "Feb '15", uv: 2390, pv: 3800 },
  { name: "Dec '15", uv: 3490, pv: 4300 },
]

// eslint-disable-next-line
const generateDot = ({ stroke, ...other }) => (
  <Dot {...other} fill={stroke} stroke={colors['white']} r={4} strokeWidth={2} />
)

const generateActiveDot = (props) => <Dot {...props} stroke={colors['white']} r={7} />

const SimpleLineChart = () => (
  <ResponsiveContainer width="100%" aspect={6.0 / 3.0}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line
        dataKey="pv"
        stroke={colors['success']}
        dot={generateDot}
        activeDot={generateActiveDot}
        name="Success"
      />
      <Line
        dataKey="uv"
        stroke={colors['purple']}
        dot={generateDot}
        activeDot={generateActiveDot}
        name="Fail"
      />
    </LineChart>
  </ResponsiveContainer>
)

export { SimpleLineChart }
