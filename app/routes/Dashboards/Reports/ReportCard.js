import React from 'react'
import { Card, CardBody, CardTitle } from './../../../components'
import ReportPiChartItem from './ReportPiChartItem'
import mystyle from './style'

function ReportCard({ title, data, upValue, downValue }) {
  const className = 'mb-3 gluucard'
  return (
    <Card className={className}>
      <CardBody>
        <CardTitle tag="h6" className="mb-4">
          <div style={mystyle.gcard}>{title}</div>
        </CardTitle>
        <ReportPiChartItem data={data} />
        <div>
          <div className="mb-3">
            <h2>{upValue}</h2>
          </div>
          <div>
            <i className="fa fa-caret-down fa-fw text-success"></i>
            {downValue}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default ReportCard
