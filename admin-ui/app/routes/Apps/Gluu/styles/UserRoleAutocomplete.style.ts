import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { customColors } from '@/customColors'
import { CEDARLING_CONFIG_SPACING, MAPPING_SPACING } from '@/constants'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'
import applicationStyle from './applicationStyle'

interface UserRoleAutocompleteStyleParams {
  themeColors: ThemeConfig
  allowCustom?: boolean
  isDark?: boolean
  inputBackgroundColor?: string
  withWrapper?: boolean
}

export const useStyles = makeStyles<UserRoleAutocompleteStyleParams>()((
  _,
  { themeColors, allowCustom, isDark = false, inputBackgroundColor, withWrapper = true },
) => {
  const settings = themeColors.settings
  const inputBorderColor = settings?.inputBorder ?? themeColors.borderColor
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const defaultPlainInputBg = settings?.cardBackground ?? themeColors.card.background
  const defaultWrappedInputBg =
    settings?.formInputBackground ??
    (isDark ? customColors.darkDropdownBg : themeColors.inputBackground)
  const inputBg =
    inputBackgroundColor ?? (withWrapper ? defaultWrappedInputBg : defaultPlainInputBg)
  const fontColor = themeColors.fontColor
  const optionHoverBg = themeColors.table.rowHoverBg

  return {
    card: {
      backgroundColor: cardBg,
      border: `1px solid ${inputBorderColor}`,
      borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      padding: 16,
      boxSizing: 'border-box',
    },
    plain: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      width: '100%',
    },
    header: {
      color: fontColor,
      fontWeight: fontWeights.semiBold,
      marginBottom: withWrapper ? 12 : 6,
    },
    requiredMark: {
      color: fontColor,
      fontSize: 'inherit',
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
    newSelectionPrefix: {
      flexShrink: 0,
    },
    newSelectionValue: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontWeight: fontWeights.bold,
    },
    autocompleteRoot: {
      'position': 'relative',
      'flex': 1,
      'minWidth': 0,
      '&& .MuiOutlinedInput-root': {
        'backgroundColor': `${inputBg} !important`,
        'minHeight': CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
        'height': 'auto',
        'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px !important`,
        'overflow': 'hidden',
        'color': fontColor,
        'outline': 'none',
        'border': `1px solid ${inputBorderColor}`,
        'caretColor': fontColor,
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
          'paddingTop': CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
          'paddingBottom': CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
          'paddingLeft': CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
          'paddingRight': 44,
          'boxSizing': 'border-box',
          'color': `${fontColor} !important`,
          'caretColor': fontColor,
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
          'right': 12,
          'background': 'transparent',
          'border': 'none',
          'paddingLeft': 0,
          'marginLeft': 0,
          'gap': 0,
          '& .MuiAutocomplete-popupIndicator': {
            transform: 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          },
          '& .MuiAutocomplete-popupIndicatorOpen': {
            transform: 'rotate(180deg)',
          },
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
              background: optionHoverBg,
              border: 'none',
              boxShadow: 'none',
            },
            '&:focus, &:focus-visible': {
              outline: 'none',
              boxShadow: 'none',
              border: 'none',
              background: optionHoverBg,
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
      'backgroundColor': `${cardBg} !important`,
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
            backgroundColor: optionHoverBg,
          },
          '&.Mui-focused': {
            outline: 'none',
            backgroundColor: optionHoverBg,
          },
          '&[aria-selected="true"]': {
            backgroundColor: themeColors.badges.statusActiveBg,
            color: themeColors.badges.statusActive,
          },
          '&[aria-selected="true"].Mui-focused': {
            backgroundColor: themeColors.badges.statusActiveBg,
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
      fontSize: fontSizes.sm,
      lineHeight: '18px',
      fontWeight: fontWeights.semiBold,
      maxWidth: '100%',
      overflow: 'hidden',
    },
    tagLabel: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: 'inherit',
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
    error: {
      display: 'block',
      color: themeColors.errorColor,
      marginTop: 8,
      fontSize: fontSizes.sm,
    },
    helperText: {
      display: 'block',
      color: themeColors.textMuted,
      marginTop: 8,
      fontSize: fontSizes.sm,
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
