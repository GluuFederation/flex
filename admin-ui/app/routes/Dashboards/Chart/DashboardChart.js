import React from 'react'
import {
  XAxis,
  YAxis,
  Bar,
  BarChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import './styles.css'
import { useSelector } from 'react-redux'
import TooltipDesign from './TooltipDesign'
import moment from 'moment'

const DashboardChart = () => {
  const statData = useSelector((state) => state.mauReducer.stat)
  const startMonth = useSelector((state) => state.mauReducer.startMonth)
  const endMonth = useSelector((state) => state.mauReducer.endMonth)

  function doDataAugmentation(stat) {
    if (startMonth && endMonth) {
      var dateStart = moment(startMonth, 'YYYYMM')
      var dateEnd = moment(endMonth, 'YYYYMM')
      var prepareStat = []
      while (
        dateEnd > dateStart ||
        dateStart.format('M') === dateEnd.format('M')
      ) {
        let available = stat.filter((obj) => {
          return obj.month == dateStart.format('YYYYMM')
        })
        if (available.length) {
          prepareStat.push(available[0])
        } else {
          const newEntry = new Object()
          newEntry['month'] = dateStart.format('YYYYMM')
          newEntry['mau'] = 0
          newEntry['client_credentials_access_token_count'] = 0
          newEntry['authz_code_access_token_count'] = 0
          newEntry['authz_code_idtoken_count'] = 0
          prepareStat.push(newEntry)
        }
        dateStart.add(1, 'month')
      }
      return prepareStat
    } else {
      return stat
    }
  }

  return (
    <ResponsiveContainer width="100%" aspect={6.0 / 2.4}>
      <BarChart
        data={doDataAugmentation(statData)}
        margin={{ top: 5, right: 30, bottom: 5 }}
      >
        <XAxis dataKey={'month'} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<TooltipDesign />} />
        <Legend wrapperStyle={{ color: '#fff' }} />
        <Bar dataKey="client_credentials_access_token_count" fill={'#FE9F01'} />
        <Bar dataKey="authz_code_access_token_count" fill={'#9CBEE0'} />
        <Bar dataKey="authz_code_idtoken_count" fill={'#8D9460'} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default DashboardChart
