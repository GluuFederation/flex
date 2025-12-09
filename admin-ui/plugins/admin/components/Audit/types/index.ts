import { Dayjs } from 'dayjs'

export interface AuditRow {
  id: number
  serial: number
  log: string
}

export interface AuditSearchProps {
  pattern: string
  startDate: Dayjs | null
  endDate: Dayjs | null
  isLoading: boolean
  onPatternChange: (value: string) => void
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
  onSearch: () => void
  onRefresh: () => void
  isSearchDisabled: boolean
}
