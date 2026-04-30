import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import type { SxProps, Theme } from '@mui/material/styles'
import { getLoadingOverlayRgba } from '@/customColors'
import { getHoverOpacity, getDividerOpacity, OPACITY, BORDER_RADIUS } from '@/constants'
import { fontFamily, fontSizes, fontWeights, letterSpacing } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/config'
import type { PickerThemeColors, GluuDatePickerStyleParams } from './types'

const TEXT_FIELD_SIZE = 'small' as const

const buildPickerThemeColors = (
  themeConfig: ThemeConfig,
  isDark: boolean,
  textColor?: string,
  backgroundColor?: string,
): PickerThemeColors => {
  const inputText = textColor || themeConfig.fontColor
  const borderColor = isDark ? 'transparent' : themeConfig.borderColor
  const hoverBg = getLoadingOverlayRgba(themeConfig.fontColor, getHoverOpacity(isDark))
  return {
    labelBackground: backgroundColor || themeConfig.background,
    inputBackground: themeConfig.inputBackground,
    inputTextColor: inputText,
    labelColor: inputText,
    borderColor,
    popupBg: themeConfig.dashboard.supportCard,
    popupBorderColor: getLoadingOverlayRgba(themeConfig.fontColor, getDividerOpacity(isDark)),
    selectedBg: themeConfig.fontColor,
    selectedText: themeConfig.background,
    hoverBg,
    placeholderColor: themeConfig.textMuted,
    iconColor: themeConfig.fontColor,
  }
}

const useLayoutStyles = makeStyles<{ labelColor: string }>()((_, { labelColor }) => {
  const titleLabelBase = {
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: labelColor,
    letterSpacing: letterSpacing.normal,
    display: 'block' as const,
  }
  return {
    pickerWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      minWidth: 0,
      flex: '1 1 0',
    },
    rangeRowContainer: {
      'display': 'flex',
      'gap': 16,
      'width': '100%',
      'minWidth': 0,
      '& > *': { flex: '1 1 0', minWidth: 0 },
    },
    rangeGridContainer: {
      width: '100%',
    },
    titleLabel: { ...titleLabelBase, marginBottom: 0 },
    titleLabelGrid: { ...titleLabelBase, marginBottom: '6px' },
  }
})

type PickerSxObject = SxProps<Theme>

const buildCommonInputStyles = (tc: PickerThemeColors): PickerSxObject => ({
  '& .MuiInputLabel-root': {
    'color': tc.labelColor,
    '&.Mui-focused': { color: tc.labelColor },
  },
  '& .MuiIconButton-root': {
    'color': tc.iconColor,
    '&:hover': {
      backgroundColor: tc.hoverBg,
      color: tc.inputTextColor,
    },
    '& .MuiSvgIcon-root': { color: tc.iconColor },
  },
  '& .MuiSvgIcon-root': { color: tc.iconColor },
})

const buildTextFieldSx = (
  tc: PickerThemeColors,
  common: PickerSxObject,
  inputHeight?: number,
): SxProps<Theme> => ({
  'width': '100%',
  'maxWidth': '100%',
  'boxSizing': 'border-box',
  ...(common as SxProps<Theme>),
  '& .MuiInputBase-root': {
    color: tc.inputTextColor,
    backgroundColor: tc.inputBackground,
    ...(inputHeight != null ? { height: inputHeight, minHeight: inputHeight } : {}),
  },
  '& .MuiInputBase-input': {
    fontFamily,
    'fontSize': fontSizes.base,
    'color': tc.inputTextColor,
    '&::placeholder': { color: tc.placeholderColor, opacity: OPACITY.PLACEHOLDER },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: tc.borderColor },
    '&:hover fieldset': { borderColor: tc.borderColor },
    '&.Mui-focused fieldset': { borderColor: tc.borderColor },
  },
})

const buildPopperSx = (tc: PickerThemeColors): SxProps<Theme> => ({
  '& .MuiPaper-root': {
    'backgroundColor': tc.popupBg,
    'color': tc.inputTextColor,
    'borderRadius': `${BORDER_RADIUS.SMALL}px`,
    'boxShadow': 'none',
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: tc.borderColor },
      '&:hover fieldset': { borderColor: tc.borderColor },
      '&.Mui-focused fieldset': { borderColor: tc.borderColor },
    },
    // Calendar header
    '& .MuiPickersCalendarHeader-root': {
      'color': tc.inputTextColor,
      '& .MuiPickersCalendarHeader-switchViewButton': { color: tc.inputTextColor },
      '& .MuiPickersCalendarHeader-switchViewIcon': { color: tc.inputTextColor },
    },
    // Day cells
    '& .MuiPickersDay-root': {
      'backgroundColor': 'transparent',
      'color': tc.inputTextColor,
      '&.MuiPickersDay-today': {
        'borderColor': tc.inputTextColor,
        '&.Mui-selected': { borderColor: 'transparent' },
      },
      '&.Mui-selected': {
        'backgroundColor': tc.selectedBg,
        'color': tc.selectedText,
        '&:hover': { backgroundColor: tc.selectedBg },
      },
      '&:hover': { backgroundColor: tc.hoverBg },
      '&.Mui-disabled': { color: tc.placeholderColor, opacity: OPACITY.PLACEHOLDER },
    },
    '& .MuiDayCalendar-weekContainer': {
      '& .MuiTypography-root': { color: tc.inputTextColor },
    },
    '& .MuiDayCalendar-header': {
      '& .MuiDayCalendar-weekDayLabel': { color: tc.inputTextColor },
    },
    '& .MuiPickersArrowSwitcher-root': {
      '& .MuiIconButton-root': {
        'color': tc.inputTextColor,
        '&:hover': { backgroundColor: tc.hoverBg },
      },
    },
    // Toolbar (date/time display at top of dialog)
    '& .MuiPickersToolbar-root': {
      backgroundColor: tc.popupBg,
      color: tc.inputTextColor,
    },
    '& .MuiDateTimePickerToolbar-root': {
      backgroundColor: tc.popupBg,
    },
    '& .MuiPickersToolbar-content .MuiTypography-root': {
      color: tc.inputTextColor,
    },
    '& .MuiDateTimePickerToolbar-dateContainer .MuiTypography-root': {
      color: tc.inputTextColor,
    },
    '& .MuiDateTimePickerToolbar-timeContainer .MuiTypography-root': {
      color: tc.inputTextColor,
    },
    '& .MuiPickersToolbarButton-root': {
      color: tc.inputTextColor,
    },
    // Tabs (Date / Time switch)
    '& .MuiDateTimePickerTabs-root': {
      backgroundColor: tc.popupBg,
      borderBottom: `1px solid ${tc.borderColor}`,
    },
    '& .MuiTab-root': {
      'color': tc.placeholderColor,
      '&.Mui-selected': { color: tc.inputTextColor },
    },
    '& .MuiTabs-indicator': {
      backgroundColor: tc.inputTextColor,
    },
    // Clock face
    '& .MuiClock-root': {
      backgroundColor: tc.popupBg,
    },
    '& .MuiClock-clock': {
      backgroundColor: tc.hoverBg,
    },
    '& .MuiClock-pin': {
      backgroundColor: tc.iconColor,
    },
    '& .MuiClockPointer-root': {
      backgroundColor: tc.iconColor,
    },
    '& .MuiClockPointer-thumb': {
      backgroundColor: tc.iconColor,
      borderColor: tc.iconColor,
    },
    '& .MuiClockNumber-root': {
      'color': tc.inputTextColor,
      '&.Mui-selected': {
        backgroundColor: tc.iconColor,
        color: tc.popupBg,
      },
    },
    // Digital clock / multi-section time field
    '& .MuiDigitalClock-root': {
      backgroundColor: tc.popupBg,
    },
    '& .MuiDigitalClock-item': {
      'color': tc.inputTextColor,
      '&.Mui-selected': {
        backgroundColor: tc.selectedBg,
        color: tc.selectedText,
      },
      '&:hover': { backgroundColor: tc.hoverBg },
    },
    '& .MuiMultiSectionDigitalClock-root': {
      backgroundColor: tc.popupBg,
      borderTop: `1px solid ${tc.borderColor}`,
    },
    '& .MuiMultiSectionDigitalClockSection-root': {
      'borderRight': `1px solid ${tc.borderColor}`,
      '&:last-child': { borderRight: 'none' },
    },
    '& .MuiMultiSectionDigitalClockSection-item': {
      'color': tc.inputTextColor,
      '&.Mui-selected': {
        backgroundColor: tc.selectedBg,
        color: tc.selectedText,
      },
      '&:hover': { backgroundColor: tc.hoverBg },
    },
    // Dialog divider
    '& .MuiDivider-root': {
      borderColor: tc.borderColor,
    },
    // Action buttons (OK / Cancel)
    '& .MuiDialogActions-root': {
      backgroundColor: tc.popupBg,
      borderTop: `1px solid ${tc.borderColor}`,
    },
    '& .MuiDialogActions-root .MuiButton-root': {
      color: tc.inputTextColor,
    },
  },
})

const buildDatePickerRootSx = (tc: PickerThemeColors, common: PickerSxObject): SxProps<Theme> => ({
  'width': '100%',
  'maxWidth': '100%',
  'minWidth': 0,
  'flex': '1 1 auto',
  'boxSizing': 'border-box',
  ...(common as SxProps<Theme>),
  '& .MuiInputLabel-sizeSmall': {
    fontFamily,
    'padding': '0px 2px',
    'background': tc.labelBackground,
    'color': tc.labelColor,
    'fontSize': fontSizes.base,
    'fontWeight': fontWeights.medium,
    'marginTop': '-2px',
    '&.Mui-focused': { color: tc.labelColor },
  },
})

export const useDatePickerStyles = (params: GluuDatePickerStyleParams) => {
  const {
    themeColors,
    isDark,
    textColor,
    backgroundColor,
    inputHeight,
    labelShrink = true,
  } = params
  const pickerTheme = useMemo(
    () => buildPickerThemeColors(themeColors, isDark, textColor, backgroundColor),
    [themeColors, isDark, textColor, backgroundColor],
  )
  const { classes } = useLayoutStyles({ labelColor: pickerTheme.labelColor })

  const sx = useMemo(() => {
    const common = buildCommonInputStyles(pickerTheme)
    const textFieldSx = buildTextFieldSx(pickerTheme, common, inputHeight)
    const popperSx = buildPopperSx(pickerTheme)
    const datePickerSx = buildDatePickerRootSx(pickerTheme, common)
    const paperSx: SxProps<Theme> = {
      backgroundColor: pickerTheme.popupBg,
      color: pickerTheme.inputTextColor,
    }
    const slotProps = {
      textField: {
        size: TEXT_FIELD_SIZE,
        InputLabelProps: { shrink: labelShrink },
        sx: textFieldSx,
      },
      popper: { sx: popperSx },
      desktopPaper: { sx: paperSx },
      paper: { sx: paperSx },
    }
    return {
      textFieldSx,
      popperSx,
      datePickerSx,
      slotProps,
    }
  }, [pickerTheme, inputHeight, labelShrink])

  return {
    classes,
    ...sx,
  }
}
