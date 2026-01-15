import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, letterSpacing, lineHeights } from '@/styles/fonts'

export const SHARED_DROPDOWN_STYLES = {
  borderRadius: '16px',
  padding: '16px',
  minWidth: '143px',
  maxHeight: '400px',
  margin: '9px',
  arrowWidth: '14.5px',
  arrowHeight: '9.5px',
  arrowZIndex: 999,
  menuZIndex: 1000,
  optionMinHeight: '42px',
  optionPadding: '12px 48px 12px 12px',
  optionGap: '12px',
  optionMarginBottom: '2px',
  searchPadding: '8px 12px',
  searchMarginBottom: '12px',
  searchBorderRadius: '8px',
  emptyMessagePadding: '20px',
  dividerMargin: '8px 0',
} as const

export interface BaseOptionStylesParams {
  isDark: boolean
  optionPadding?: string
  optionBorderRadius?: string
  optionGap?: string
}

export const createBaseOptionStyles = ({
  isDark,
  optionPadding = SHARED_DROPDOWN_STYLES.optionPadding,
  optionBorderRadius = SHARED_DROPDOWN_STYLES.searchBorderRadius,
  optionGap = SHARED_DROPDOWN_STYLES.optionGap,
}: BaseOptionStylesParams) => {
  const baseStyles: Record<string, unknown> = {
    'padding': optionPadding,
    'borderRadius': optionBorderRadius,
    'cursor': 'pointer',
    fontFamily,
    'fontSize': fontSizes.md,
    'fontWeight': fontWeights.semiBold,
    'lineHeight': lineHeights.tight,
    'letterSpacing': letterSpacing.wide,
    'color': isDark ? customColors.white : customColors.textSecondary,
    'transition': 'all 0.2s ease',
    'marginBottom': SHARED_DROPDOWN_STYLES.optionMarginBottom,
    'minHeight': SHARED_DROPDOWN_STYLES.optionMinHeight,
    'display': 'flex',
    'alignItems': 'center',
    '&:last-child': {
      marginBottom: 0,
    },
    '&:hover:not(.disabled)': {
      backgroundColor: isDark ? customColors.darkBackground : customColors.buttonLightBg,
      color: isDark ? customColors.white : customColors.primaryDark,
    },
    '&.selected': {
      backgroundColor: isDark ? customColors.darkBackground : customColors.buttonLightBg,
      color: isDark ? customColors.white : customColors.textSecondary,
    },
    '&.disabled': {
      'opacity': 0.5,
      'cursor': 'not-allowed',
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'inherit',
      },
    },
  }

  if (optionGap !== undefined) {
    baseStyles.gap = optionGap
  }

  return baseStyles
}

export interface TriggerStylesParams {
  isDark: boolean
  minWidth?: string
  padding?: string
}

export const createTriggerStyles = ({
  isDark,
  minWidth = '67px',
  padding = '0px 14px',
}: TriggerStylesParams) => ({
  'border': `1px solid ${isDark ? customColors.white : customColors.primaryDark}`,
  'borderRadius': '4px',
  'height': '44px',
  'padding': padding,
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'space-between',
  'minWidth': minWidth,
  'cursor': 'pointer',
  'backgroundColor': 'transparent',
  'fontFamily': fontFamily,
  'fontSize': fontSizes.base,
  'fontWeight': fontWeights.medium,
  'lineHeight': lineHeights.relaxed,
  'color': isDark ? customColors.white : customColors.textSecondary,
  '&:hover': {
    opacity: 0.8,
  },
})

export const chevronStyles = {
  marginLeft: '8px',
  fontSize: '18px',
  color: 'inherit',
}
