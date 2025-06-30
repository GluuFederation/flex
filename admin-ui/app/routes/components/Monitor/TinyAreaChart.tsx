// @ts-nocheck
import React from 'react'
import _ from 'lodash'
import { ResponsiveContainer, AreaChart, Area } from 'Components/recharts'

import colors from './../../../colors'

// Generate deterministic mock data using a sine wave pattern
const generateMockData = () => {
  return _.times(20, (index) => ({
    pv: Math.sin(index * 0.5) * 50 + 50, // Creates a wave pattern between 0-100
  }))
}

const data = generateMockData()

const TinyAreaChart = () => (
  <ResponsiveContainer width="100%" height={40}>
    <AreaChart data={data}>
      <Area dataKey="pv" stroke={colors['primary']} fill={colors['primary-03']} />
    </AreaChart>
  </ResponsiveContainer>
)

export { TinyAreaChart }
