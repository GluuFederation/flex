import { makeStyles } from 'tss-react/mui'
import { MAPPING_SPACING } from '@/constants'
import customColors from '@/customColors'
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
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6,
      minHeight: 52,
      padding: '8px 44px 8px 16px',
      backgroundColor: formInputBg,
      border: `1px solid ${inputBorderColor}`,
      borderRadius: `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      cursor: 'pointer',
      color: fontColor,
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.15s ease',
    },
    selectTriggerOpen: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    selectTriggerDisabled: {
      cursor: 'not-allowed',
    },
    placeholder: {
      color: fontColor,
      fontSize: 14,
      userSelect: 'none',
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '4px 4px 4px 10px',
      borderRadius: 999,
      backgroundColor: themeColors.badges?.statusActiveBg ?? customColors.statusActiveBg,
      color: themeColors.badges?.statusActive ?? customColors.statusActive,
      border: `1px solid ${themeColors.badges?.statusActive ?? customColors.statusActive}`,
      fontSize: 12,
      fontWeight: 600,
      lineHeight: '18px',
      whiteSpace: 'nowrap',
    },
    chipRemove: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': 22,
      'height': 22,
      'borderRadius': '50%',
      'border': 'none',
      'padding': 0,
      'cursor': 'pointer',
      'background': themeColors.badges?.statusActive ?? customColors.statusActive,
      'color': themeColors.badges?.filledBadgeText ?? customColors.white,
      'fontSize': 13,
      'lineHeight': 1,
      '&:hover': {
        opacity: 0.8,
      },
    },
    chevronWrapper: {
      position: 'absolute',
      right: 16,
      top: 14,
      transform: 'none',
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
      overflowY: 'auto',
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
        backgroundColor: isDark ? customColors.darkDropdownBg : customColors.lightGray,
      },
    },
    optionItemSelected: {
      backgroundColor: isDark ? customColors.darkDropdownBg : customColors.lightGray,
    },
    checkbox: {
      'width': 18,
      'height': 18,
      'borderRadius': 4,
      'border': isDark
        ? `1.2px solid ${customColors.white}`
        : `1.2px solid ${customColors.textSecondary}`,
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
      'backgroundColor': isDark ? customColors.white : customColors.statusActiveBg,
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
      color: textMuted,
      marginTop: 4,
      fontSize: 12,
    },
  }
})
