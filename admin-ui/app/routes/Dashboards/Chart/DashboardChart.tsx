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

// Type definitions
interface StatDataItem {
  month: string
  mau: number
  client_credentials_access_token_count: number
  authz_code_access_token_count: number
  authz_code_idtoken_count: number
}

interface RootState {
  mauReducer: {
    stat: StatDataItem[]
    loading: boolean
    startMonth: string
    endMonth: string
  }
}

const DashboardChart: React.FC = () => {
  const statData = useSelector((state: RootState) => state.mauReducer.stat)
  const startMonth = useSelector((state: RootState) => state.mauReducer.startMonth)
  const endMonth = useSelector((state: RootState) => state.mauReducer.endMonth)

  function doDataAugmentation(stat: StatDataItem[]): StatDataItem[] {
    if (startMonth && endMonth) {
      const dateStart = moment(startMonth, 'YYYYMM')
      const dateEnd = moment(endMonth, 'YYYYMM')
      const prepareStat: StatDataItem[] = []
      while (
        dateEnd > dateStart ||
        dateStart.format('M') === dateEnd.format('M')
      ) {
        const available = stat.filter((obj: StatDataItem) => {
          return obj.month == dateStart.format('YYYYMM')
        })
        if (available.length) {
          prepareStat.push(available[0])
        } else {
          const newEntry: StatDataItem = {
            month: dateStart.format('YYYYMM'),
            mau: 0,
            client_credentials_access_token_count: 0,
            authz_code_access_token_count: 0,
            authz_code_idtoken_count: 0
          }
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
    <ResponsiveContainer debounce={300} width="100%" height="100%">
      <BarChart
        data={doDataAugmentation(statData)}
        margin={{ top: 5, right: 30, bottom: 5 }}
        height={400}
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
