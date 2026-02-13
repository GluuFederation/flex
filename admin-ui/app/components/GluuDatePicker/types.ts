import type { Dayjs } from '@/utils/dayjsUtils'

interface GluuDatePickerBase {
  format?: string
  dateFormat?: string
  textColor?: string
  backgroundColor?: string
  inputHeight?: number
}

export interface GluuDatePickerSingleProps extends GluuDatePickerBase {
  mode?: 'single'
  value?: Dayjs | null
  onChange: (date: Dayjs | null) => void
  onAccept?: (date: Dayjs | null) => void
  label?: string
  minDate?: Dayjs
  maxDate?: Dayjs
  labelShrink?: boolean
}

export interface GluuDatePickerRangeProps extends GluuDatePickerBase {
  mode: 'range'
  startDate: Dayjs
  endDate: Dayjs
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
  onStartDateAccept?: (date: Dayjs | null) => void
  onEndDateAccept?: (date: Dayjs | null) => void
  layout?: 'grid' | 'row'
  labelAsTitle?: boolean
}

export type GluuDatePickerProps = GluuDatePickerSingleProps | GluuDatePickerRangeProps

export function isGluuDatePickerRangeProps(
  props: GluuDatePickerProps,
): props is GluuDatePickerRangeProps {
  return props.mode === 'range'
}
