import React, { memo, useMemo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import type { Dayjs } from 'dayjs'
import { isSameDate } from '@/utils/dayjsUtils'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { hexToRgb } from '@/customColors'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'

interface DateRangeProps {
  startDate: Dayjs
  endDate: Dayjs
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
  onStartDateAccept?: (date: Dayjs | null) => void
  onEndDateAccept?: (date: Dayjs | null) => void
  textColor?: string
  backgroundColor?: string
  isDark?: boolean
  dateFormat?: string
}

const DateRange = memo(
  ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onStartDateAccept,
    onEndDateAccept,
    textColor,
    backgroundColor,
    isDark: _isDark = false,
    dateFormat = 'MM/DD/YYYY',
  }: DateRangeProps) => {
    const { t } = useTranslation()
    const theme = useContext(ThemeContext) as { state?: { theme?: string } } | undefined
    const selectedTheme = theme?.state?.theme ?? DEFAULT_THEME
    const globalThemeColors = getThemeColor(selectedTheme)
    const isDarkTheme = selectedTheme === THEME_DARK

    const themeColors = useMemo(() => {
      const labelBg = backgroundColor || globalThemeColors.background
      const inputBg = globalThemeColors.inputBackground
      const inputText = textColor || globalThemeColors.fontColor
      const labelText = textColor || globalThemeColors.fontColor
      const borderColor = isDarkTheme ? 'transparent' : globalThemeColors.borderColor
      const popupBg = globalThemeColors.dashboard.supportCard
      const selectedBg = globalThemeColors.background
      const selectedText = globalThemeColors.fontColor
      const hoverBg = `rgba(${hexToRgb(globalThemeColors.fontColor)}, ${isDarkTheme ? 0.08 : 0.04})`
      const placeholderColor = globalThemeColors.fontColor
      const iconColor = globalThemeColors.fontColor

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
    }, [backgroundColor, textColor, isDarkTheme, globalThemeColors])

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
            'color': themeColors.inputTextColor,
            '& .MuiPickersCalendarHeader-switchViewButton': {
              color: themeColors.inputTextColor,
            },
            '& .MuiPickersCalendarHeader-switchViewIcon': {
              color: themeColors.inputTextColor,
            },
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
          '& .MuiDayCalendar-header': {
            '& .MuiDayCalendar-weekDayLabel': {
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
              format={dateFormat}
              label={t('dashboard.start_date')}
              value={startDate}
              onChange={onStartDateChange}
              onAccept={onStartDateAccept}
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
              format={dateFormat}
              label={t('dashboard.end_date')}
              value={endDate}
              onChange={onEndDateChange}
              onAccept={onEndDateAccept}
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
        ? isSameDate(prevProps.startDate, nextProps.startDate)
        : prevProps.startDate === nextProps.startDate

    const endDateSame =
      prevProps.endDate && nextProps.endDate
        ? isSameDate(prevProps.endDate, nextProps.endDate)
        : prevProps.endDate === nextProps.endDate

    return (
      startDateSame &&
      endDateSame &&
      prevProps.textColor === nextProps.textColor &&
      prevProps.backgroundColor === nextProps.backgroundColor &&
      prevProps.isDark === nextProps.isDark &&
      prevProps.dateFormat === nextProps.dateFormat &&
      prevProps.onStartDateChange === nextProps.onStartDateChange &&
      prevProps.onEndDateChange === nextProps.onEndDateChange &&
      prevProps.onStartDateAccept === nextProps.onStartDateAccept &&
      prevProps.onEndDateAccept === nextProps.onEndDateAccept
    )
  },
)

DateRange.displayName = 'DateRange'

export default DateRange
