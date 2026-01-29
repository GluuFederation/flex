import React from 'react'
import { Card, CardBody, CardTitle, Badge } from 'Components'
import ReportPiChartItem from './ReportPiChartItem'
import GluuRibbon from 'Routes/Apps/Gluu/GluuRibbon'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import type { ReportCardProps } from '../types'

function ReportCard({ title, data, upValue, downValue }: ReportCardProps) {
  return (
    <Card className="mb-3" style={{ borderRadius: '10px' }}>
      <CardBody>
        <CardTitle tag="h6" className="mb-4">
          <GluuRibbon title={title} fromLeft />
        </CardTitle>
        <ReportPiChartItem data={data} />
        <div>
          <div className="mb-3">
            <GluuText variant="h2">{upValue}</GluuText>
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
