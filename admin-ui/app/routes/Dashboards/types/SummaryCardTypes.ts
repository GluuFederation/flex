export type SummaryCardClasses = {
  summary: string
  summaryText: string
  summaryValue: string
}

export type SummaryCardProps = {
  text: string
  value: number | null
  classes: SummaryCardClasses
}
