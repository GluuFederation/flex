import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, letterSpacing, lineHeights } from '@/styles/fonts'
import type { DropdownPosition } from '../GluuDropdown/types'

const DROPDOWN_CONSTANTS = {
  borderRadius: '16px',
  minWidth: '143px',
  margin: '9px',
  arrowWidth: '14.5px',
  arrowHeight: '9.5px',
  menuZIndex: 1000,
  optionMinHeight: '42px',
  optionPadding: '10px 20px',
  optionMarginBottom: '2px',
  optionBorderRadius: '8px',
} as const

const getPositionStyles = (position: DropdownPosition) => {
  switch (position) {
    case 'top':
      return {
        bottom: '100%',
        marginBottom: DROPDOWN_CONSTANTS.margin,
      }
    case 'bottom':
      return {
        top: '100%',
        marginTop: DROPDOWN_CONSTANTS.margin,
      }
    case 'left':
      return {
        right: '100%',
        marginRight: DROPDOWN_CONSTANTS.margin,
      }
    case 'right':
      return {
        left: '100%',
        marginLeft: DROPDOWN_CONSTANTS.margin,
      }
    default:
      return {}
  }
}

const getArrowStyles = (position: DropdownPosition) => {
  const baseStyles = {
    position: 'absolute' as const,
    width: DROPDOWN_CONSTANTS.arrowWidth,
    height: DROPDOWN_CONSTANTS.arrowHeight,
  }

  switch (position) {
    case 'top':
      return {
        ...baseStyles,
        bottom: `-${DROPDOWN_CONSTANTS.margin}`,
        left: '50%',
        transform: 'translateX(-50%)',
      }
    case 'bottom':
      return {
        ...baseStyles,
        top: `-${DROPDOWN_CONSTANTS.margin}`,
        left: '50%',
        transform: 'translateX(-50%) rotate(180deg)',
      }
    case 'left':
      return {
        ...baseStyles,
        right: `-${DROPDOWN_CONSTANTS.margin}`,
        top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
      }
    case 'right':
      return {
        ...baseStyles,
        left: `-${DROPDOWN_CONSTANTS.margin}`,
        top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
      }
    default:
      return baseStyles
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
    border: 'none',
    borderRadius: DROPDOWN_CONSTANTS.borderRadius,
    boxShadow: `0px 4px 11px 0px ${customColors.shadowLight}`,
    padding: '22px 20px',
    minWidth: DROPDOWN_CONSTANTS.minWidth,
    ...getPositionStyles(position),
  },
  arrow: {
    ...getArrowStyles(position),
    '& svg': {
      width: '100%',
      height: '100%',
      fill: dropdownBg,
    },
  },
  option: {
    'padding': DROPDOWN_CONSTANTS.optionPadding,
    'borderRadius': DROPDOWN_CONSTANTS.optionBorderRadius,
    'cursor': 'pointer',
    'fontFamily': fontFamily,
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
    '&:last-child': {
      marginBottom: 0,
    },
    '&:hover': {
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
      'pointerEvents': 'none',
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'inherit',
      },
    },
  },
}))
