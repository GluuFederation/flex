import { Card, CardBody, CardTitle, Badge } from 'Components'
import { ArrowDropDown } from '@/components/icons'
import ReportPiChartItem from './ReportPiChartItem'
import GluuRibbon from 'Routes/Apps/Gluu/GluuRibbon'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import type { ReportCardProps } from '../types'
import { useStyles } from './ReportCard.style'

const ReportCard = ({ title, data, upValue, downValue }: ReportCardProps) => {
  const { classes } = useStyles()
  return (
    <Card className={classes.card}>
      <CardBody>
        <CardTitle tag="h6" className={classes.title}>
          <GluuRibbon title={title} fromLeft />
        </CardTitle>
        <ReportPiChartItem data={data} />
        <div>
          <div className={classes.valueRow}>
            <GluuText variant="h2">{upValue}</GluuText>
          </div>
          <div>
            <ArrowDropDown className={classes.trendIcon} />
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
