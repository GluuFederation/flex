import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import applicationStyle from '../../Apps/Gluu/styles/applicationstyle'
import customColors from '@/customColors'
import type { ReportPiChartItemProps, PieChartLabelProps } from '../types'

function ReportPiChartItem({ data }: ReportPiChartItemProps) {
  const COLORS = [customColors.lightGreen, customColors.black]
  const RADIAN = Math.PI / 180

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieChartLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill={customColors.white}
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
        fill={customColors.lightBlue}
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend iconType="star" />
      <Tooltip contentStyle={applicationStyle.homeStatTooltip} />
    </PieChart>
  )
}

export default ReportPiChartItem
