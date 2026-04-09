import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { customColors, getLoadingOverlayRgba } from '@/customColors'
import { CEDARLING_CONFIG_SPACING, MAPPING_SPACING } from '@/constants'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'
import applicationStyle from './applicationStyle'

interface UserRoleAutocompleteStyleParams {
  themeColors: ThemeConfig
  allowCustom?: boolean
  isDark?: boolean
  inputBackgroundColor?: string
}

export const useStyles = makeStyles<UserRoleAutocompleteStyleParams>()((
  _,
  { themeColors, allowCustom, isDark = false, inputBackgroundColor },
) => {
  const settings = themeColors.settings
  const inputBorderColor = settings?.inputBorder ?? themeColors.borderColor
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputBg =
    inputBackgroundColor ?? (isDark ? customColors.darkDropdownBg : themeColors.inputBackground)
  const fontColor = themeColors.fontColor

  return {
    card: {
      backgroundColor: cardBg,
      border: `1px solid ${inputBorderColor}`,
      borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      padding: 16,
      boxSizing: 'border-box',
    },
    header: {
      color: fontColor,
      fontWeight: 600,
      marginBottom: 12,
    },
    controls: {
      'display': 'grid',
      'gridTemplateColumns': allowCustom ? 'minmax(0, 1fr) auto' : '1fr',
      'gap': 12,
      'alignItems': 'center',
      '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
      },
    },
    autocompleteWrapper: {
      minWidth: 0,
      flex: 1,
      display: 'flex',
    },
    autocompleteRoot: {
      'position': 'relative',
      'flex': 1,
      'minWidth': 0,
      '&& .MuiOutlinedInput-root': {
        'backgroundColor': `${inputBg} !important`,
        'color': fontColor,
        'outline': 'none',
        'border': `1px solid ${inputBorderColor}`,
        '& .MuiOutlinedInput-notchedOutline': {
          display: 'none',
        },
        '&:hover': {
          borderColor: inputBorderColor,
        },
        '&.Mui-focused, &.Mui-focusVisible': {
          outline: 'none !important',
          boxShadow: 'none !important',
          borderColor: inputBorderColor,
          borderWidth: '1px',
        },
        '& .MuiOutlinedInput-input': {
          'outline': 'none !important',
          'outlineWidth': 0,
          'outlineStyle': 'none',
          'boxShadow': 'none !important',
          'border': 'none !important',
          'backgroundColor': 'transparent',
          '&:focus, &:focus-visible': {
            outline: 'none !important',
            outlineWidth: 0,
            outlineStyle: 'none',
            boxShadow: 'none !important',
            border: 'none !important',
          },
          '&::before, &::after': {
            display: 'none !important',
          },
        },
        '&.Mui-focused .MuiOutlinedInput-input, &.Mui-focusVisible .MuiOutlinedInput-input': {
          outline: 'none !important',
          outlineWidth: 0,
          outlineStyle: 'none',
          boxShadow: 'none !important',
          border: 'none !important',
        },
        '& .MuiAutocomplete-endAdornment': {
          'right': 4,
          'background': 'transparent',
          'border': 'none',
          'paddingLeft': 0,
          'marginLeft': 0,
          'gap': 0,
          '& .MuiIconButton-root': {
            'color': fontColor,
            'padding': 6,
            'minWidth': 32,
            'width': 32,
            'height': 32,
            'border': 'none',
            'background': 'transparent',
            'boxShadow': 'none',
            'outline': 'none',
            'borderRadius': 4,
            '&:hover': {
              background: getLoadingOverlayRgba(fontColor, 0.08),
              border: 'none',
              boxShadow: 'none',
            },
            '&:focus, &:focus-visible': {
              outline: 'none',
              boxShadow: 'none',
              border: 'none',
              background: getLoadingOverlayRgba(fontColor, 0.08),
            },
            '&:not(:last-of-type)': { marginRight: 2 },
          },
        },
      },
      '& .MuiInputLabel-root, & .MuiInputBase-input': {
        color: fontColor,
      },
      '& .MuiInputBase-input::placeholder': {
        color: themeColors.textMuted,
        opacity: 1,
      },
    },
    dropdownPaper: {
      /* Match Available Claims panel list: same background and hover */
      'backgroundColor': cardBg,
      'color': fontColor,
      'borderLeft': `1px solid ${inputBorderColor}`,
      'borderRight': `1px solid ${inputBorderColor}`,
      'borderBottom': `1px solid ${inputBorderColor}`,
      'boxShadow': 'none !important',
      'borderRadius': `0 0 ${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px ${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      'marginTop': 0,
      'width': '100%',
      'minWidth': '100%',
      'maxWidth': '100%',
      'boxSizing': 'border-box',
      '& .MuiAutocomplete-listbox': {
        'width': '100%',
        'maxWidth': '100%',
        'boxSizing': 'border-box',
        'color': fontColor,
        'padding': '8px 0',
        'backgroundColor': 'transparent',
        '& .MuiAutocomplete-option': {
          'color': fontColor,
          '&:hover': {
            backgroundColor: getLoadingOverlayRgba(fontColor, isDark ? 0.12 : 0.08),
          },
          '&.Mui-focused': {
            outline: 'none',
            backgroundColor: getLoadingOverlayRgba(fontColor, isDark ? 0.12 : 0.08),
          },
          '&[aria-selected="true"]': {
            backgroundColor: themeColors.badges?.statusActiveBg ?? inputBg,
            color: themeColors.badges?.statusActive ?? fontColor,
          },
          '&[aria-selected="true"].Mui-focused': {
            backgroundColor: themeColors.badges?.statusActiveBg ?? inputBg,
            outline: 'none',
          },
        },
      },
      '& .MuiAutocomplete-loading, & .MuiAutocomplete-noOptions': {
        color: themeColors.textMuted ?? fontColor,
      },
    },
    selectWrapper: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      alignItems: 'center',
      gap: 8,
      minWidth: 0,
    },
    searchInput: {
      'width': '100%',
      'minHeight': CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
      'backgroundColor': inputBg,
      'color': fontColor,
      'border': `1px solid ${inputBorderColor}`,
      'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      'paddingTop': CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
      'paddingBottom': CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
      'paddingLeft': 21,
      'paddingRight': 16,
      'boxSizing': 'border-box' as const,
      'fontSize': 14,
      'fontFamily': 'inherit',
      'outline': 'none',
      '&::placeholder': {
        color: themeColors.textMuted,
      },
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    },
    hiddenSelect: {
      position: 'absolute',
      opacity: 0,
      pointerEvents: 'none',
      width: 0,
      height: 0,
    },
    chevronButton: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': 44,
      'minWidth': 44,
      'height': CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
      'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      'border': `1px solid ${inputBorderColor}`,
      'backgroundColor': inputBg,
      'color': fontColor,
      'cursor': 'pointer',
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    },
    clearButton: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': 44,
      'minWidth': 44,
      'height': CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
      'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      'border': `1px solid ${inputBorderColor}`,
      'backgroundColor': inputBg,
      'color': fontColor,
      'cursor': 'pointer',
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
      '& i': {
        fontSize: 16,
        color: 'inherit',
      },
    },
    addButton: {
      '&&': {
        display: 'inline-flex',
        minHeight: 44,
        height: 44,
        padding: '8px 20px',
        gap: 8,
        flexShrink: 0,
        justifyContent: 'center',
        alignItems: 'center',
        color: `${themeColors.formFooter.apply.textColor} !important`,
        fontFamily,
        fontSize: fontSizes.base,
        fontStyle: 'normal',
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.button,
      },
      '& *': {
        color: 'inherit',
      },
    },
    tags: {
      marginTop: 12,
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
    },
    tag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 4px 4px 10px',
      borderRadius: 999,
      backgroundColor: themeColors.badges.statusActiveBg,
      color: themeColors.badges.statusActive,
      border: `1px solid ${themeColors.badges.statusActive}`,
      fontSize: 12,
      lineHeight: '18px',
      fontWeight: 600,
      maxWidth: '100%',
      overflow: 'hidden',
    },
    tagRemove: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': 22,
      'height': 22,
      'borderRadius': '50%',
      'border': 'none',
      'background': themeColors.badges.statusActive,
      'color': themeColors.badges.filledBadgeText,
      'fontSize': 13,
      'lineHeight': 1,
      'cursor': 'pointer',
      'padding': 0,
      '&:hover': {
        opacity: 0.8,
      },
    },
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    cardWrapper: {
      flex: 1,
      minWidth: 0,
    },
    removeFieldButton: {
      ...(applicationStyle.removableInputRow as object),
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': 32,
      'height': 32,
      'minWidth': 32,
      'minHeight': 32,
      'padding': 6,
      'marginRight': 0,
      'background': 'transparent',
      'border': 'none',
      'boxShadow': 'none',
      'flexShrink': 0,
      'color': fontColor,
      '&:hover': {
        opacity: 0.8,
      },
      '&:focus-visible': {
        outline: `2px solid ${fontColor}`,
        outlineOffset: 2,
      },
      '& i': {
        fontSize: 16,
        color: 'inherit',
      },
    },
  }
})
