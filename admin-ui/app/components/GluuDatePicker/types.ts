import type { Dayjs } from '@/utils/dayjsUtils'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ThemeConfig } from '@/context/theme/config'
import type { useDatePickerStyles } from './GluuDatePicker.style'

export type PickerThemeColors = {
  labelBackground: string
  inputBackground: string
  inputTextColor: string
  labelColor: string
  borderColor: string
  popupBorderColor: string
  popupOuterBorderColor: string
  popupBg: string
  selectedBg: string
  selectedText: string
  hoverBg: string
  placeholderColor: string
  iconColor: string
}

export type GluuDatePickerStyleParams = {
  themeColors: ThemeConfig
  isDark: boolean
  textColor?: string
  backgroundColor?: string
  inputBackgroundColor?: string
  inputHeight?: number
  labelShrink?: boolean
  forceIcon?: boolean
}

type GluuDatePickerBase = {
  format?: string
  dateFormat?: string
  textColor?: string
  // Sits behind the floating label so it does not collide with the outline. Named for what it
  // backs, not for the field: use inputBackgroundColor to fill the field itself.
  backgroundColor?: string
  // Fills the input. Left unset the field takes themeColors.inputBackground, which is right on a
  // plain form; a field sitting in a toolbar may need to match the controls beside it instead.
  inputBackgroundColor?: string
  inputHeight?: number
  showTime?: boolean
  forceIcon?: boolean
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
  disabled?: boolean
}

export type GluuDatePickerRangeProps = GluuDatePickerBase & {
  mode: 'range'
  startDate: Dayjs | null
  endDate: Dayjs | null
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
  onStartDateAccept?: (date: Dayjs | null) => void
  onEndDateAccept?: (date: Dayjs | null) => void
  layout?: 'grid' | 'row'
  labelAsTitle?: boolean
  showTime?: boolean
  startDateLabel?: string
  endDateLabel?: string
}

export type GluuDatePickerProps = GluuDatePickerSingleProps | GluuDatePickerRangeProps

export const isGluuDatePickerRangeProps = (
  props: GluuDatePickerProps,
): props is GluuDatePickerRangeProps => props.mode === 'range'

export type GluuDatePickerRangeInternalProps = GluuDatePickerRangeProps & {
  displayFormat: string
  slotProps: {
    textField: {
      size: 'small'
      slotProps: { inputLabel: { shrink: boolean } }
      sx: SxProps<Theme>
    }
    popper: { sx: SxProps<Theme> }
    desktopPaper: { sx: SxProps<Theme> }
    paper: { sx: SxProps<Theme> }
  }
  datePickerSx: SxProps<Theme>
  classes: ReturnType<typeof useDatePickerStyles>['classes']
}
