import React from 'react'
import { Card, CardBody, CardTitle, Badge } from 'Components'
import GluuRibbon from 'Routes/Apps/Gluu/GluuRibbon'

interface CustomBadgeRowProps {
  label: string
  value: string | number
}

function CustomBadgeRow({ label, value }: CustomBadgeRowProps): JSX.Element {
  return (
    <Card className="mb-3" type="border" color={null}>
      <CardBody>
        <CardTitle tag="h6" className="mb-4">
          <GluuRibbon title={label} />
        </CardTitle>
        <Badge color="primary" style={{ fontWeight: 'bold', fontSize: '2.5em' }}>
          {value}
        </Badge>
      </CardBody>
    </Card>
  )
}

export default CustomBadgeRow
