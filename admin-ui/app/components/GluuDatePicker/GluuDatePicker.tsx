import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { SxProps, Theme } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { createDate, isSameDate, DATE_FORMATS } from '@/utils/dayjsUtils'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import type {
  GluuDatePickerProps,
  GluuDatePickerSingleProps,
  GluuDatePickerRangeProps,
} from './types'
import { isGluuDatePickerRangeProps } from './types'
import { useDatePickerStyles } from './GluuDatePicker.style'

const rangePropsEqual = (a: GluuDatePickerRangeProps, b: GluuDatePickerRangeProps): boolean => {
  const startDateSame =
    a.startDate && b.startDate ? isSameDate(a.startDate, b.startDate) : a.startDate === b.startDate
  const endDateSame =
    a.endDate && b.endDate ? isSameDate(a.endDate, b.endDate) : a.endDate === b.endDate
  return (
    startDateSame &&
    endDateSame &&
    a.layout === b.layout &&
    a.labelAsTitle === b.labelAsTitle &&
    a.inputHeight === b.inputHeight &&
    a.textColor === b.textColor &&
    a.backgroundColor === b.backgroundColor &&
    (a.dateFormat ?? a.format) === (b.dateFormat ?? b.format) &&
    a.onStartDateChange === b.onStartDateChange &&
    a.onEndDateChange === b.onEndDateChange &&
    a.onStartDateAccept === b.onStartDateAccept &&
    a.onEndDateAccept === b.onEndDateAccept
  )
}

const GluuDatePicker = memo(
  (props: GluuDatePickerProps) => {
    const { state: themeState } = useTheme()
    const selectedTheme = themeState?.theme ?? DEFAULT_THEME
    const globalThemeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
    const isDarkTheme = selectedTheme === THEME_DARK

    const isRange = isGluuDatePickerRangeProps(props)
    const labelShrink = isRange ? !props.labelAsTitle : (props.labelShrink ?? true)
    const displayFormat = props.dateFormat ?? props.format ?? DATE_FORMATS.DATE_PICKER_DISPLAY_US

    const { classes, slotProps, datePickerSx } = useDatePickerStyles({
      themeColors: globalThemeColors,
      isDark: isDarkTheme,
      textColor: props.textColor,
      backgroundColor: props.backgroundColor,
      inputHeight: props.inputHeight,
      labelShrink,
    })

    if (isRange) {
      return (
        <GluuDatePickerRange
          {...props}
          displayFormat={displayFormat}
          slotProps={slotProps}
          datePickerSx={datePickerSx}
          classes={classes}
        />
      )
    }

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          format={displayFormat}
          label={props.label ?? ''}
          value={props.value ?? null}
          onChange={props.onChange}
          onAccept={props.onAccept}
          minDate={props.minDate}
          maxDate={props.maxDate}
          slotProps={slotProps}
          sx={datePickerSx}
        />
      </LocalizationProvider>
    )
  },
  (prevProps, nextProps) => {
    if (isGluuDatePickerRangeProps(prevProps) && isGluuDatePickerRangeProps(nextProps)) {
      return rangePropsEqual(prevProps, nextProps)
    }
    if (isGluuDatePickerRangeProps(prevProps) || isGluuDatePickerRangeProps(nextProps)) {
      return false
    }
    const prev = prevProps as GluuDatePickerSingleProps
    const next = nextProps as GluuDatePickerSingleProps
    return (
      prev.value === next.value &&
      prev.onChange === next.onChange &&
      prev.onAccept === next.onAccept &&
      prev.label === next.label &&
      (prev.labelShrink ?? true) === (next.labelShrink ?? true) &&
      (prev.dateFormat ?? prev.format) === (next.dateFormat ?? next.format) &&
      prev.inputHeight === next.inputHeight &&
      prev.textColor === next.textColor &&
      prev.backgroundColor === next.backgroundColor &&
      prev.minDate === next.minDate &&
      prev.maxDate === next.maxDate
    )
  },
)

GluuDatePicker.displayName = 'GluuDatePicker'

type GluuDatePickerRangeInternalProps = GluuDatePickerRangeProps & {
  displayFormat: string
  slotProps: {
    textField: { size: 'small'; InputLabelProps: { shrink: boolean }; sx: SxProps<Theme> }
    popper: { sx: SxProps<Theme> }
  }
  datePickerSx: SxProps<Theme>
  classes: ReturnType<typeof useDatePickerStyles>['classes']
}

const GluuDatePickerRange = memo(
  ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onStartDateAccept,
    onEndDateAccept,
    layout = 'grid',
    labelAsTitle = false,
    displayFormat,
    slotProps,
    datePickerSx,
    classes,
  }: GluuDatePickerRangeInternalProps) => {
    const { t } = useTranslation()
    const today = useMemo(() => createDate(), [])

    const pickerCommon = useMemo(
      () => ({
        format: displayFormat,
        slotProps,
        sx: datePickerSx,
      }),
      [displayFormat, slotProps, datePickerSx],
    )

    const renderPicker = (type: 'start' | 'end') => {
      const isStart = type === 'start'
      const label = isStart ? t('dashboard.start_date') : t('dashboard.end_date')
      return (
        <DatePicker
          {...pickerCommon}
          label={labelAsTitle ? '' : label}
          value={isStart ? startDate : endDate}
          onChange={isStart ? onStartDateChange : onEndDateChange}
          onAccept={isStart ? onStartDateAccept : onEndDateAccept}
          minDate={isStart ? undefined : startDate}
          maxDate={isStart ? endDate : today}
        />
      )
    }

    const startLabel = t('dashboard.start_date')
    const endLabel = t('dashboard.end_date')

    const rowLayout = (
      <Box className={classes.rangeRowContainer}>
        <Box className={classes.pickerWrapper}>
          {labelAsTitle && (
            <Box component="span" className={classes.titleLabel}>
              {startLabel}:
            </Box>
          )}
          {renderPicker('start')}
        </Box>
        <Box className={classes.pickerWrapper}>
          {labelAsTitle && (
            <Box component="span" className={classes.titleLabel}>
              {endLabel}:
            </Box>
          )}
          {renderPicker('end')}
        </Box>
      </Box>
    )

    const gridLayout = (
      <Grid container spacing={2} className={classes.rangeGridContainer}>
        <Grid item xs={12} sm={6}>
          {labelAsTitle && (
            <Box component="span" className={classes.titleLabelGrid}>
              {startLabel}:
            </Box>
          )}
          {renderPicker('start')}
        </Grid>
        <Grid item xs={12} sm={6}>
          {labelAsTitle && (
            <Box component="span" className={classes.titleLabelGrid}>
              {endLabel}:
            </Box>
          )}
          {renderPicker('end')}
        </Grid>
      </Grid>
    )

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {layout === 'row' ? rowLayout : gridLayout}
      </LocalizationProvider>
    )
  },
)

GluuDatePickerRange.displayName = 'GluuDatePickerRange'

export { GluuDatePicker }
export default GluuDatePicker
