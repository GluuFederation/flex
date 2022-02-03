import React from 'react'
import { Card, CardBody, CardTitle, Badge } from '../../../../app/components'
import PieChartItem from './PieChartItem'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'

function PieCard({ data }) {
  return <PieChartItem data={data} />
}

export default PieCard
