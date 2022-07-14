import React, { useEffect, useState } from 'react'
import {
  XAxis,
  YAxis,
  Bar,
  BarChart,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import './styles.css'
import { useSelector } from 'react-redux'

const data = [{ name: 'Sample A', height: 40 }]

const DashboardChart = () => {
  const statData = useSelector((state) => state.mauReducer.stat)
  const [graphData, setGraphData] = useState([{ name: 'Sample A', height: 40 }])
  useEffect(() => {
    console.log('Stats Data', statData)
    let data = []
    for (let i in statData) {
      let obj = {
        name: statData[i].month,
        height: statData[i].authz_code_access_token_count,
      }
      data.push(obj)
    }
    let temp = [...graphData]
    temp = data
    setGraphData(temp)
  }, [statData])

  return (
    <ResponsiveContainer width="100%" aspect={6.0 / 2.4}>
      <BarChart data={graphData} margin={{ top: 5, right: 30, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis dataKey="height" />
        <Legend wrapperStyle={{ color: '#fff' }} />
        <Bar dataKey="height" fill={'#4C5B66'} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default DashboardChart
