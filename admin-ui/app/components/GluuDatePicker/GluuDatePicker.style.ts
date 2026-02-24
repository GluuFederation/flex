import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ThemeConfig } from '@/context/theme/config'
import { hexToRgb } from '@/customColors'
import { OPACITY } from '@/constants/ui'
import { fontFamily, fontSizes, fontWeights, letterSpacing } from '@/styles/fonts'

const TEXT_FIELD_SIZE = 'small' as const

interface PickerThemeColors {
  labelBackground: string
  inputBackground: string
  inputTextColor: string
  labelColor: string
  borderColor: string
  popupBg: string
  selectedBg: string
  selectedText: string
  hoverBg: string
  placeholderColor: string
  iconColor: string
}

interface GluuDatePickerStyleParams {
  themeColors: ThemeConfig
  isDark: boolean
  textColor?: string
  backgroundColor?: string
  inputHeight?: number
  labelShrink?: boolean
}

const buildPickerThemeColors = (
  themeConfig: ThemeConfig,
  isDark: boolean,
  textColor?: string,
  backgroundColor?: string,
): PickerThemeColors => {
  const inputText = textColor || themeConfig.fontColor
  const borderColor = isDark ? 'transparent' : themeConfig.borderColor
  const hoverBg = `rgba(${hexToRgb(themeConfig.fontColor)}, ${isDark ? OPACITY.HOVER_DARK : OPACITY.HOVER_LIGHT})`
  return {
    labelBackground: backgroundColor || themeConfig.background,
    inputBackground: themeConfig.inputBackground,
    inputTextColor: inputText,
    labelColor: inputText,
    borderColor,
    popupBg: themeConfig.dashboard.supportCard,
    selectedBg: themeConfig.background,
    selectedText: themeConfig.fontColor,
    hoverBg,
    placeholderColor: themeConfig.fontColor,
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

/** Plain object sx so it can be safely spread (SxProps can be array/callback/false). */
type PickerSxObject = Record<string, unknown>

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
    '&::placeholder': { color: tc.placeholderColor, opacity: 1 },
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
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: tc.borderColor },
      '&:hover fieldset': { borderColor: tc.borderColor },
      '&.Mui-focused fieldset': { borderColor: tc.borderColor },
    },
    '& .MuiPickersCalendarHeader-root': {
      'color': tc.inputTextColor,
      '& .MuiPickersCalendarHeader-switchViewButton': { color: tc.inputTextColor },
      '& .MuiPickersCalendarHeader-switchViewIcon': { color: tc.inputTextColor },
    },
    '& .MuiPickersDay-root': {
      'color': tc.inputTextColor,
      '&.Mui-selected': {
        'backgroundColor': tc.selectedBg,
        'color': tc.selectedText,
        '&:hover': { backgroundColor: tc.selectedBg },
      },
      '&:hover': { backgroundColor: tc.hoverBg },
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
    const slotProps = {
      textField: {
        size: TEXT_FIELD_SIZE,
        InputLabelProps: { shrink: labelShrink },
        sx: textFieldSx,
      },
      popper: { sx: popperSx },
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
