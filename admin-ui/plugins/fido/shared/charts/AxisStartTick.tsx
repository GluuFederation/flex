import React from 'react'
import type { AxisStartTickProps } from './types'

const AXIS_TICK_MIDDLE_SHIFT = '0.355em'

const AxisStartTick: React.FC<AxisStartTickProps> = ({
  y,
  payload,
  tickFormatter,
  index = 0,
  fill,
  fontSize,
}) => {
  const raw = payload?.value
  const label = tickFormatter ? tickFormatter(raw as never, index) : String(raw ?? '')

  return (
    <text
      x={0}
      y={y}
      dy={AXIS_TICK_MIDDLE_SHIFT}
      textAnchor="start"
      fill={fill}
      fontSize={fontSize}
    >
      {label}
    </text>
  )
}

export default AxisStartTick
