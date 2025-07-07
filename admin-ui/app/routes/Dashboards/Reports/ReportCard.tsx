import React from 'react'
import { Card, CardBody, CardTitle, Badge } from 'Components'
import ReportPiChartItem from './ReportPiChartItem'
import GluuRibbon from 'Routes/Apps/Gluu/GluuRibbon'

interface ReportCardProps {
  title: string
  data: Array<{ name: string; value: number }>
  upValue: string | number
  downValue: string | number
}

function ReportCard({ title, data, upValue, downValue }: ReportCardProps) {
  return (
    <Card className="mb-3" type="border" color={null}>
      <CardBody>
        <CardTitle tag="h6" className="mb-4">
          <GluuRibbon title={title} fromLeft />
        </CardTitle>
        <ReportPiChartItem data={data} />
        <div>
          <div className="mb-3">
            <h2>{upValue}</h2>
          </div>
          <div>
            <i className="fa fa-caret-down fa-fw text-success"></i>
            <Badge pill color="primary">
              {downValue}
            </Badge>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default ReportCard
