import React, { memo, useMemo } from 'react'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import type { Dayjs } from 'dayjs'

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
      const inputText = textColor || (isDark ? customColors.white : customColors.primaryDark)
      const labelText = textColor || (isDark ? customColors.white : customColors.primaryDark)
      const borderColor = isDark ? customColors.darkBorder : customColors.borderInput
      const popupBg = isDark ? customColors.darkCardBg : customColors.white
      const selectedBg = isDark ? customColors.darkBorder : customColors.primaryDark
      const selectedText = customColors.white
      const hoverBgDark = 'rgba(255, 255, 255, 0.08)'
      const hoverBgLight = 'rgba(0, 0, 0, 0.04)'
      const hoverBg = isDark ? hoverBgDark : hoverBgLight
      const placeholderColor = isDark ? customColors.white : customColors.primaryDark
      const iconColor = isDark ? customColors.white : customColors.primaryDark

      return {
        labelBackground: labelBg,
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

    const textFieldSx = useMemo(
      () => ({
        'width': '100%',
        '& .MuiInputBase-root': {
          color: themeColors.inputTextColor,
          backgroundColor: isDark ? customColors.darkInputBg : customColors.white,
        },
        '& .MuiInputBase-input': {
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
      [themeColors, isDark],
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
        '& .MuiInputLabel-sizeSmall': {
          padding: '0 2px',
          background: themeColors.labelBackground,
          color: themeColors.labelColor,
          fontSize: '19px',
          marginTop: '-2px',
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
    return (
      prevProps.startDate.isSame(nextProps.startDate) &&
      prevProps.endDate.isSame(nextProps.endDate) &&
      prevProps.textColor === nextProps.textColor &&
      prevProps.backgroundColor === nextProps.backgroundColor &&
      prevProps.isDark === nextProps.isDark
    )
  },
)

DateRange.displayName = 'DateRange'

export default DateRange
