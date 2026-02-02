import { memo } from 'react'
import Paper from '@mui/material/Paper'
import GluuText from 'Routes/Apps/Gluu/GluuText'

interface ClassesType {
  summary: string
  summaryText: string
  summaryValue: string
}

interface SummaryCardProps {
  text: string
  value: number | null
  classes: ClassesType
}

export const SummaryCard = memo<SummaryCardProps>(({ text, value, classes }) => (
  <Paper className={classes.summary} elevation={0}>
    <GluuText variant="div" className={classes.summaryText}>
      {text}
    </GluuText>
    <GluuText variant="div" className={classes.summaryValue}>
      {value !== null ? value : '—'}
    </GluuText>
  </Paper>
))

SummaryCard.displayName = 'SummaryCard'
