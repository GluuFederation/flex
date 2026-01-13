import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, letterSpacing, lineHeights } from '@/styles/fonts'
import type { DropdownPosition } from './types'

const DROPDOWN_CONSTANTS = {
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

const getPositionStyles = (position: DropdownPosition) => {
  const baseTransform =
    position === 'top' || position === 'bottom'
      ? { left: '50%', transform: 'translateX(-50%)' }
      : { top: '50%', transform: 'translateY(-50%)' }

  switch (position) {
    case 'top':
      return {
        bottom: '100%',
        marginBottom: DROPDOWN_CONSTANTS.margin,
        ...baseTransform,
      }
    case 'bottom':
      return {
        top: '100%',
        marginTop: DROPDOWN_CONSTANTS.margin,
        ...baseTransform,
      }
    case 'left':
      return {
        right: '100%',
        marginRight: DROPDOWN_CONSTANTS.margin,
        ...baseTransform,
      }
    case 'right':
      return {
        left: '100%',
        marginLeft: DROPDOWN_CONSTANTS.margin,
        ...baseTransform,
      }
    default:
      return {}
  }
}

const getArrowStyles = (position: DropdownPosition) => {
  switch (position) {
    case 'top':
      return {
        bottom: '0px',
        left: '50%',
        transform: 'translateX(-50%) rotate(180deg)',
      }
    case 'bottom':
      return {
        top: '0px',
        left: '50%',
        transform: 'translateX(-50%)',
      }
    case 'left':
      return {
        right: '0px',
        top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
      }
    case 'right':
      return {
        left: '0px',
        top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
      }
    default:
      return {}
  }
}

export const useStyles = makeStyles<{
  isDark: boolean
  position: DropdownPosition
  dropdownBg: string
}>()((theme, { isDark, position, dropdownBg }) => ({
  dropdownWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownMenu: {
    position: 'absolute',
    zIndex: DROPDOWN_CONSTANTS.menuZIndex,
    backgroundColor: dropdownBg,
    borderRadius: DROPDOWN_CONSTANTS.borderRadius,
    boxShadow: `0px 4px 11px 0px ${customColors.shadowLight}`,
    padding: DROPDOWN_CONSTANTS.padding,
    minWidth: DROPDOWN_CONSTANTS.minWidth,
    maxHeight: DROPDOWN_CONSTANTS.maxHeight,
    overflowY: 'auto',
    overflow: 'visible',
    ...getPositionStyles(position),
  },
  arrow: {
    'position': 'absolute',
    'width': DROPDOWN_CONSTANTS.arrowWidth,
    'height': DROPDOWN_CONSTANTS.arrowHeight,
    'zIndex': DROPDOWN_CONSTANTS.arrowZIndex,
    'pointerEvents': 'none',
    ...getArrowStyles(position),
    '& svg': {
      width: '100%',
      height: '100%',
      fill: dropdownBg,
      color: dropdownBg,
      filter: `drop-shadow(0px -1px 2px ${customColors.shadowDark})`,
    },
  },
  searchInput: {
    'width': '100%',
    'padding': DROPDOWN_CONSTANTS.searchPadding,
    'marginBottom': DROPDOWN_CONSTANTS.searchMarginBottom,
    'borderRadius': DROPDOWN_CONSTANTS.searchBorderRadius,
    'border': `1px solid ${isDark ? customColors.darkBorder : customColors.lightBorder}`,
    'backgroundColor': isDark ? customColors.darkInputBg : customColors.white,
    'color': isDark ? customColors.white : customColors.primaryDark,
    fontFamily,
    'fontSize': fontSizes.base,
    '&:focus': {
      outline: 'none',
      borderColor: isDark ? customColors.darkBorderAccent : customColors.primaryDark,
    },
    '&::placeholder': {
      color: isDark ? customColors.textMutedDark : customColors.textSecondary,
    },
  },
  option: {
    'padding': DROPDOWN_CONSTANTS.optionPadding,
    'borderRadius': DROPDOWN_CONSTANTS.searchBorderRadius,
    'cursor': 'pointer',
    fontFamily,
    'fontSize': fontSizes.md,
    'fontWeight': fontWeights.semiBold,
    'lineHeight': lineHeights.tight,
    'letterSpacing': letterSpacing.wide,
    'color': isDark ? customColors.white : customColors.textSecondary,
    'transition': 'all 0.2s ease',
    'marginBottom': DROPDOWN_CONSTANTS.optionMarginBottom,
    'minHeight': DROPDOWN_CONSTANTS.optionMinHeight,
    'display': 'flex',
    'alignItems': 'center',
    'gap': DROPDOWN_CONSTANTS.optionGap,
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
      },
    },
  },
  divider: {
    height: '1px',
    backgroundColor: isDark ? customColors.darkBorder : customColors.lightBorder,
    margin: DROPDOWN_CONSTANTS.dividerMargin,
  },
  emptyMessage: {
    padding: DROPDOWN_CONSTANTS.emptyMessagePadding,
    textAlign: 'center',
    color: isDark ? customColors.textMutedDark : customColors.textSecondary,
    fontFamily,
    fontSize: fontSizes.sm,
  },
}))
