import React from 'react';
import times from 'lodash/times';
import {  
  ResponsiveContainer,
  AreaChart, 
  Area
} from 'recharts';

import colors from './../../../colors';

const data = times(20, () => ({ pv: Math.random() * 100 }));

const TinyAreaChartSpend = () => (
  <ResponsiveContainer width='100%' height={ 125 }>
    <AreaChart data={data}>
      <Area dataKey='pv' stroke={ colors['primary'] } fill={ colors['primary-02'] } />
    </AreaChart>
  </ResponsiveContainer>
);

export { TinyAreaChartSpend };
