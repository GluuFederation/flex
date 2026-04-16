import { makeStyles } from 'tss-react/mui'
import { alpha } from '@mui/material/styles'
import { MAPPING_SPACING, OPACITY } from '@/constants'
import customColors from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'

interface GluuSelectRowStyleParams {
  themeColors: ThemeConfig
  inputHeight: number
  inputPaddingTop: number
  inputPaddingBottom: number
}

export const useStyles = makeStyles<GluuSelectRowStyleParams>()((
  _theme,
  { themeColors, inputHeight, inputPaddingTop, inputPaddingBottom },
) => {
  const fontColor = themeColors.fontColor
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor

  return {
    colWrapper: {
      position: 'relative',
    },
    selectWrapper: {
      position: 'relative',
    },
    select: {
      'paddingRight': '44px !important',
      'WebkitAppearance': 'none',
      'MozAppearance': 'none',
      'appearance': 'none',
      'backgroundImage': 'none !important',
      '&:has(option[value=""]:checked)': {
        color: `${alpha(fontColor, OPACITY.PLACEHOLDER)} !important`,
      },
      '&:focus': {
        backgroundImage: 'none !important',
        outline: 'none',
        boxShadow: 'none',
      },
    },
    chevronWrapper: {
      position: 'absolute',
      right: 20,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: fontColor,
      zIndex: 6,
    },
    error: {
      display: 'block',
      color: customColors.accentRed,
      marginTop: 4,
      fontSize: 12,
    },
    autocompleteRoot: {
      'width': '100%',
      '& .MuiOutlinedInput-root': {
        'backgroundColor': `${formInputBg} !important`,
        'height': inputHeight,
        'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px !important`,
        'overflow': 'hidden',
        'border': `1px solid ${inputBorderColor}`,
        'outline': 'none',
        'boxShadow': 'none',
        'color': `${fontColor} !important`,
        'caretColor': fontColor,
        '& .MuiOutlinedInput-notchedOutline': { display: 'none' },
        '& fieldset': { display: 'none', border: 'none' },
        '&:hover': {
          border: `1px solid ${inputBorderColor}`,
          backgroundColor: `${formInputBg} !important`,
          outline: 'none',
          boxShadow: 'none',
        },
        '&.Mui-focused, &.Mui-focusVisible': {
          border: `1px solid ${inputBorderColor} !important`,
          backgroundColor: `${formInputBg} !important`,
          boxShadow: 'none',
          outline: 'none',
        },
        '& .MuiOutlinedInput-input': {
          paddingTop: inputPaddingTop,
          paddingBottom: inputPaddingBottom,
          paddingLeft: 21,
          paddingRight: 21,
          boxSizing: 'border-box',
          border: 'none !important',
          borderRadius: 0,
          outline: 'none',
          backgroundColor: 'transparent !important',
          boxShadow: 'none !important',
          color: `${fontColor} !important`,
          caretColor: fontColor,
        },
      },
    },
  }
})
