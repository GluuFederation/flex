import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'

function PieChartItem({ data }) {
  const COLORS = ['#7aefc0', '#3B4371']
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        cx={80}
        cy={80}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((e, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend iconType="star" />
      <Tooltip contentStyle={applicationStyle.homeStatTooltip} />
    </PieChart>
  )
}

export default PieChartItem
