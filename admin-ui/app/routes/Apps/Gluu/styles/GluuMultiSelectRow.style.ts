import { makeStyles } from 'tss-react/mui'
import { MAPPING_SPACING } from '@/constants'
import customColors, { hexToRgb } from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'

interface GluuMultiSelectRowStyleParams {
  themeColors: ThemeConfig
  isDark: boolean
}

export const useStyles = makeStyles<GluuMultiSelectRowStyleParams>()((
  _theme,
  { themeColors, isDark },
) => {
  const fontColor = themeColors.fontColor
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const textMuted = themeColors.textMuted ?? customColors.textSecondary

  return {
    colWrapper: {
      position: 'relative',
    },
    selectTrigger: {
      'position': 'relative',
      'display': 'flex',
      'alignItems': 'center',
      'flexWrap': 'wrap' as const,
      'gap': 6,
      'minHeight': 52,
      'padding': '8px 44px 8px 16px',
      'backgroundColor': formInputBg,
      'border': `1px solid ${inputBorderColor}`,
      'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      'cursor': 'pointer',
      'color': fontColor,
      'outline': 'none',
      'boxSizing': 'border-box' as const,
      'transition': 'border-color 0.15s ease',
      '&:focus-within': {
        borderColor: inputBorderColor,
      },
    },
    selectTriggerOpen: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    selectTriggerDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    placeholder: {
      color: textMuted,
      opacity: 0.7,
      fontSize: 14,
      userSelect: 'none' as const,
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '4px 10px',
      backgroundColor: isDark ? customColors.statusActiveBgDark : customColors.statusActiveBg,
      color: customColors.statusActive,
      borderRadius: 4,
      fontSize: 13,
      fontWeight: 500,
      lineHeight: '18px',
      whiteSpace: 'nowrap' as const,
    },
    chipRemove: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': 16,
      'height': 16,
      'borderRadius': '50%',
      'border': 'none',
      'padding': 0,
      'cursor': 'pointer',
      'backgroundColor': customColors.statusActive,
      'color': customColors.white,
      'fontSize': 11,
      'lineHeight': 1,
      '&:hover': {
        backgroundColor: customColors.logo,
      },
    },
    chevronWrapper: {
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: fontColor,
      zIndex: 6,
      transition: 'transform 0.2s ease',
    },
    dropdownList: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: formInputBg,
      border: `1px solid ${inputBorderColor}`,
      borderTop: 'none',
      borderBottomLeftRadius: `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      borderBottomRightRadius: `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      maxHeight: 220,
      overflowY: 'auto' as const,
      boxShadow: isDark
        ? `0 4px 12px rgba(${hexToRgb(customColors.black)}, 0.4)`
        : `0 4px 12px rgba(${hexToRgb(customColors.black)}, 0.08)`,
    },
    optionItem: {
      'display': 'flex',
      'alignItems': 'center',
      'gap': 10,
      'padding': '10px 16px',
      'cursor': 'pointer',
      'fontSize': 14,
      'color': fontColor,
      'transition': 'background-color 0.15s ease',
      '&:hover': {
        backgroundColor: isDark ? customColors.darkCardBg : customColors.lightGray,
      },
    },
    optionItemSelected: {
      backgroundColor: isDark ? customColors.darkCardBg : customColors.lightGray,
    },
    checkbox: {
      'width': 18,
      'height': 18,
      'borderRadius': 4,
      'border': isDark
        ? `1.2px solid ${customColors.white}`
        : `1.2px solid ${customColors.lightGray}`,
      'backgroundColor': isDark ? 'transparent' : customColors.white,
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'flexShrink': 0,
      'transition': 'all 0.15s ease',
      '& svg': {
        display: 'none',
      },
    },
    checkboxChecked: {
      'backgroundColor': customColors.white,
      'borderColor': customColors.statusActive,
      'color': customColors.statusActive,
      '& svg': {
        display: 'block',
      },
    },
    error: {
      display: 'block',
      color: customColors.accentRed,
      marginTop: 4,
      fontSize: 12,
    },
    helperText: {
      display: 'block',
      color: isDark ? customColors.textMutedDark : customColors.textSecondary,
      marginTop: 4,
      fontSize: 12,
    },
  }
})
