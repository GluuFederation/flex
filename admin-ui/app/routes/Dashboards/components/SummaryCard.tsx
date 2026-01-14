import { memo } from 'react'
import Paper from '@mui/material/Paper'

type ClassesType = Record<string, string>

interface SummaryCardProps {
  text: string
  value: number | null
  classes: ClassesType
}

export const SummaryCard = memo<SummaryCardProps>(({ text, value, classes }) => (
  <Paper className={classes.summary} elevation={0}>
    <div className={classes.summaryText}>{text}</div>
    <div className={classes.summaryValue}>{value !== null ? value : '—'}</div>
  </Paper>
))

SummaryCard.displayName = 'SummaryCard'
