import React from 'react'
import { Card, CardFooter, CardBody, Button } from '../../../app/components'
import GluuLoader from '../../../app/routes/Apps/Gluu/GluuLoader'
import {
  LineChart,
  Line,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
//import { SimpleLineChart } from '../../../app/routes/components/Stock/SimpleLineChart'

function MaximumActiveUsersPage() {
  const data = [
    {
      name: '19-07-2021',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: '20-07-2021',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: '21-07-2021',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: '22-07-2021',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: '23-07-2021',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: '24-07-2021',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: '25-07-2021',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ]

  return (
    <GluuLoader blocking={false}>
      <ResponsiveContainer>
        <Card>
          <CardBody
            className="d-flex justify-content-center pt-5"
            style={{ minHeight: '400px' }}
          >
            <LineChart
              width={900}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name"  padding={{ left: 30, right: 30 }}/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="uv"
                stroke="#870000"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#03a96d"
                activeDot={{ r: 8 }}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            </LineChart>
          </CardBody>
          <CardFooter className="p-4 bt-0"></CardFooter>
        </Card>
      </ResponsiveContainer>
    </GluuLoader>
  )
}

export default MaximumActiveUsersPage
