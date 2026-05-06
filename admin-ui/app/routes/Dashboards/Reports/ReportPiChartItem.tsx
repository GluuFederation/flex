import { PieChart, Pie, Legend, Tooltip } from 'recharts'
import applicationStyle from '@/routes/Apps/Gluu/styles/applicationStyle'
import customColors from '@/customColors'
import type { ReportPiChartItemProps, PieChartLabelProps } from '../types'

const COLORS = [customColors.lightGreen, customColors.black]

const ReportPiChartItem = ({ data }: ReportPiChartItemProps) => {
  const RADIAN = Math.PI / 180

  const coloredData = data.map((entry, index) => ({
    ...entry,
    fill: COLORS[index % COLORS.length],
  }))

  const renderCustomizedLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
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
        data={coloredData}
        cx={80}
        cy={80}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80}
        dataKey="value"
        fill="fill"
      ></Pie>
      <Legend iconType="star" />
      <Tooltip contentStyle={applicationStyle.homeStatTooltip} />
    </PieChart>
  )
}

export default ReportPiChartItem
