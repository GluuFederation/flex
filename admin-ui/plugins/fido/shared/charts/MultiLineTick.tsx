import React from 'react'
import type { MultiLineTickProps } from './types'

const MULTI_LINE_TICK_BASELINE = 12
const MULTI_LINE_TICK_LINE_HEIGHT = 14
const MULTI_LINE_TICK_FONT_SIZE = 12

const MultiLineTick: React.FC<MultiLineTickProps> = ({
  x = 0,
  y = 0,
  payload,
  fill,
  fontSize = MULTI_LINE_TICK_FONT_SIZE,
}) => {
  const lines = (payload?.value ?? '').split('\n')

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={0}
          dy={MULTI_LINE_TICK_BASELINE + i * MULTI_LINE_TICK_LINE_HEIGHT}
          textAnchor="middle"
          fill={fill}
          fontSize={fontSize}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

export default MultiLineTick
