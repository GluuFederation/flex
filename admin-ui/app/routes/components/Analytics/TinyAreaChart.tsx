// @ts-nocheck
import React from 'react'
import PropTypes from 'prop-types'
import times from 'lodash/times'
import {  
  ResponsiveContainer,
  AreaChart, 
  Area
} from 'recharts'

import colors from './../../../colors'

// Generate deterministic mock data using a sine wave pattern
const generateMockData = () => {
  return times(20, (index) => ({
    pv: Math.sin(index * 0.5) * 50 + 50 // Creates a wave pattern between 0-100
  }))
}

const data = generateMockData()

const TinyAreaChart = ({ height }) => (
  <ResponsiveContainer width='100%' height={ height }>
    <AreaChart data={data}>
      <Area dataKey='pv' stroke={ colors['primary'] } fill={ colors['primary-02'] } />
    </AreaChart>
  </ResponsiveContainer>
)
TinyAreaChart.propTypes = {
  height: PropTypes.number,
}
TinyAreaChart.defaultProps = {
  height: 25,
}

export { TinyAreaChart }
