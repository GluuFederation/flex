import React from 'react';
import { Card, CardBody, CardTitle, Badge } from '../../../../app/components';
import GluuRibbon from '../../Apps/Gluu/GluuRibbon';

function CustomBadgeRow({ label, value }) {
  return (
    <Card className="mb-3" style={{ borderRadius: '20px', width:'200px' }}>
      <CardBody>
        <CardTitle tag="h6" className="mb-4">
          <GluuRibbon title={label} />
        </CardTitle>
        <Badge color="primary" style={{ fontWeight: 'bold', fontSize:'2.5em' }}>
          {value}
        </Badge>
      </CardBody>
    </Card>
  );
}

export default CustomBadgeRow;
