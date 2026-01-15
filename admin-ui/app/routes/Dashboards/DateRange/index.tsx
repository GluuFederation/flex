import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Dayjs } from 'dayjs'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import customColors from '@/customColors'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

interface DateRangeProps {
  startDate: Dayjs
  endDate: Dayjs
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
  textColor?: string
  backgroundColor?: string
  isDark?: boolean
}

const DateRange = memo(
  ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    textColor,
    backgroundColor,
    isDark = false,
  }: DateRangeProps) => {
    const { t } = useTranslation()

    const themeColors = useMemo(() => {
      const labelBg = backgroundColor || (isDark ? customColors.darkCardBg : customColors.white)
      const inputBg = isDark ? customColors.darkInputBg : customColors.lightInputBg
      const inputText = textColor || (isDark ? customColors.white : customColors.primaryDark)
      const labelText = textColor || (isDark ? customColors.white : customColors.primaryDark)
      const borderColor = isDark ? 'transparent' : customColors.borderInput
      const popupBg = isDark ? customColors.darkCardBg : customColors.white
      const selectedBg = isDark ? customColors.darkBorder : customColors.primaryDark
      const selectedText = customColors.white
      const hoverBg = isDark ? customColors.hoverBgDark : customColors.hoverBgLight
      const placeholderColor = isDark ? customColors.white : customColors.primaryDark
      const iconColor = isDark ? customColors.white : customColors.primaryDark

      return {
        labelBackground: labelBg,
        inputBackground: inputBg,
        inputTextColor: inputText,
        labelColor: labelText,
        borderColor,
        popupBg,
        selectedBg,
        selectedText,
        hoverBg,
        placeholderColor,
        iconColor,
      }
    }, [backgroundColor, textColor, isDark])

    const commonInputStyles = useMemo(
      () => ({
        '& .MuiInputLabel-root': {
          'color': themeColors.labelColor,
          '&.Mui-focused': {
            color: themeColors.labelColor,
          },
        },
        '& .MuiIconButton-root': {
          'color': themeColors.iconColor,
          '&:hover': {
            backgroundColor: themeColors.hoverBg,
            color: themeColors.inputTextColor,
          },
          '& .MuiSvgIcon-root': {
            color: themeColors.iconColor,
          },
        },
        '& .MuiSvgIcon-root': {
          color: themeColors.iconColor,
        },
      }),
      [themeColors],
    )

    const textFieldSx = useMemo(
      () => ({
        'width': '100%',
        'maxWidth': '100%',
        'boxSizing': 'border-box',
        ...commonInputStyles,
        '& .MuiInputBase-root': {
          color: themeColors.inputTextColor,
          backgroundColor: themeColors.inputBackground,
        },
        '& .MuiInputBase-input': {
          'fontFamily': fontFamily,
          'fontSize': fontSizes.base,
          'color': themeColors.inputTextColor,
          '&::placeholder': {
            color: themeColors.placeholderColor,
            opacity: 1,
          },
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: themeColors.borderColor,
          },
          '&:hover fieldset': {
            borderColor: themeColors.borderColor,
          },
          '&.Mui-focused fieldset': {
            borderColor: themeColors.borderColor,
          },
        },
      }),
      [themeColors, commonInputStyles],
    )

    const popperSx = useMemo(
      () => ({
        '& .MuiPaper-root': {
          'backgroundColor': themeColors.popupBg,
          'color': themeColors.inputTextColor,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: themeColors.borderColor,
            },
            '&:hover fieldset': {
              borderColor: themeColors.borderColor,
            },
            '&.Mui-focused fieldset': {
              borderColor: themeColors.borderColor,
            },
          },
          '& .MuiPickersCalendarHeader-root': {
            color: themeColors.inputTextColor,
          },
          '& .MuiPickersDay-root': {
            'color': themeColors.inputTextColor,
            '&.Mui-selected': {
              'backgroundColor': themeColors.selectedBg,
              'color': themeColors.selectedText,
              '&:hover': {
                backgroundColor: themeColors.selectedBg,
              },
            },
            '&:hover': {
              backgroundColor: themeColors.hoverBg,
            },
          },
          '& .MuiDayCalendar-weekContainer': {
            '& .MuiTypography-root': {
              color: themeColors.inputTextColor,
            },
          },
          '& .MuiPickersArrowSwitcher-root': {
            '& .MuiIconButton-root': {
              'color': themeColors.inputTextColor,
              '&:hover': {
                backgroundColor: themeColors.hoverBg,
              },
            },
          },
        },
      }),
      [themeColors],
    )

    const datePickerSx = useMemo(
      () => ({
        'width': '100%',
        'maxWidth': '100%',
        'minWidth': 0,
        'flex': '1 1 auto',
        'boxSizing': 'border-box',
        ...commonInputStyles,
        '& .MuiInputLabel-sizeSmall': {
          fontFamily,
          'padding': '0px 2px',
          'background': themeColors.labelBackground,
          'color': themeColors.labelColor,
          'fontSize': fontSizes.base,
          'fontWeight': fontWeights.medium,
          'marginTop': '-2px',
          '&.Mui-focused': {
            color: themeColors.labelColor,
          },
        },
      }),
      [themeColors, commonInputStyles],
    )

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              format="MM/DD/YYYY"
              label={t('dashboard.start_date')}
              value={startDate}
              onChange={onStartDateChange}
              slotProps={{
                textField: {
                  size: 'small',
                  InputLabelProps: { shrink: true },
                  sx: textFieldSx,
                },
                popper: {
                  sx: popperSx,
                },
              }}
              sx={datePickerSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              format="MM/DD/YYYY"
              label={t('dashboard.end_date')}
              value={endDate}
              onChange={onEndDateChange}
              slotProps={{
                textField: {
                  size: 'small',
                  InputLabelProps: { shrink: true },
                  sx: textFieldSx,
                },
                popper: {
                  sx: popperSx,
                },
              }}
              sx={datePickerSx}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    )
  },
  (prevProps, nextProps) => {
    const startDateSame =
      prevProps.startDate && nextProps.startDate
        ? prevProps.startDate.isSame(nextProps.startDate)
        : prevProps.startDate === nextProps.startDate

    const endDateSame =
      prevProps.endDate && nextProps.endDate
        ? prevProps.endDate.isSame(nextProps.endDate)
        : prevProps.endDate === nextProps.endDate

    return (
      startDateSame &&
      endDateSame &&
      prevProps.textColor === nextProps.textColor &&
      prevProps.backgroundColor === nextProps.backgroundColor &&
      prevProps.isDark === nextProps.isDark &&
      prevProps.onStartDateChange === nextProps.onStartDateChange &&
      prevProps.onEndDateChange === nextProps.onEndDateChange
    )
  },
)

DateRange.displayName = 'DateRange'

export default DateRange
