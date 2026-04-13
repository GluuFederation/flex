import type { Dayjs } from '@/utils/dayjsUtils'
import type { SxProps, Theme } from '@mui/material/styles'
import type { useDatePickerStyles } from './GluuDatePicker.style'

type GluuDatePickerBase = {
  format?: string
  dateFormat?: string
  textColor?: string
  backgroundColor?: string
  inputHeight?: number
}

export type GluuDatePickerSingleProps = GluuDatePickerBase & {
  mode?: 'single'
  value?: Dayjs | null
  onChange: (date: Dayjs | null) => void
  onAccept?: (date: Dayjs | null) => void
  label?: string
  minDate?: Dayjs
  maxDate?: Dayjs
  labelShrink?: boolean
}

export type GluuDatePickerRangeProps = GluuDatePickerBase & {
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

export const isGluuDatePickerRangeProps = (
  props: GluuDatePickerProps,
): props is GluuDatePickerRangeProps => props.mode === 'range'

export type GluuDatePickerRangeInternalProps = GluuDatePickerRangeProps & {
  displayFormat: string
  slotProps: {
    textField: { size: 'small'; InputLabelProps: { shrink: boolean }; sx: SxProps<Theme> }
    popper: { sx: SxProps<Theme> }
  }
  datePickerSx: SxProps<Theme>
  classes: ReturnType<typeof useDatePickerStyles>['classes']
}
