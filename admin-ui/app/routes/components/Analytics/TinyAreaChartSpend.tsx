// @ts-nocheck
import React from 'react'
import times from 'lodash/times'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'

import colors from './../../../colors'

// Generate deterministic mock data using a sine wave pattern
const generateMockData = () => {
  return times(20, (index) => ({
    pv: Math.sin(index * 0.5) * 50 + 50, // Creates a wave pattern between 0-100
  }))
}

const data = generateMockData()

const TinyAreaChartSpend = () => (
  <ResponsiveContainer width="100%" height={125}>
    <AreaChart data={data}>
      <Area dataKey="pv" stroke={colors['primary']} fill={colors['primary-02']} />
    </AreaChart>
  </ResponsiveContainer>
)

export { TinyAreaChartSpend }
