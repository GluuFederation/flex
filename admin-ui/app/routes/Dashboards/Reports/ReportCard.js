import React from 'react';
import { Card, CardBody, CardTitle, Badge } from '../../../../app/components';
import ReportPiChartItem from './ReportPiChartItem';
import GluuRibbon from '../../Apps/Gluu/GluuRibbon';

function ReportCard({ title, data, upValue, downValue }) {
  return (
    <Card className="mb-3" style={{ borderRadius: '10px' }}>
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
  );
}

export default ReportCard;
