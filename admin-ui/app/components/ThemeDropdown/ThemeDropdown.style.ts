import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, letterSpacing, lineHeights } from '@/styles/fonts'
import type { DropdownPosition } from '../GluuDropdown/types'

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
    zIndex: 1000,
    backgroundColor: dropdownBg,
    borderRadius: '16px',
    boxShadow: `0px 4px 11px 0px ${customColors.shadowLight}`,
    padding: '22px 20px',
    minWidth: '143px',
    ...(position === 'top' && {
      bottom: '100%',
      marginBottom: '9px',
    }),
    ...(position === 'bottom' && {
      top: '100%',
      marginTop: '9px',
    }),
    ...(position === 'left' && {
      right: '100%',
      marginRight: '9px',
    }),
    ...(position === 'right' && {
      left: '100%',
      marginLeft: '9px',
    }),
  },
  arrow: {
    'position': 'absolute',
    'width': '14.5px',
    'height': '9.5px',
    ...(position === 'top' && {
      bottom: '-9px',
      left: '50%',
      transform: 'translateX(-50%)',
    }),
    ...(position === 'bottom' && {
      top: '-9px',
      left: '50%',
      transform: 'translateX(-50%) rotate(180deg)',
    }),
    ...(position === 'left' && {
      right: '-9px',
      top: '50%',
      transform: 'translateY(-50%) rotate(-90deg)',
    }),
    ...(position === 'right' && {
      left: '-9px',
      top: '50%',
      transform: 'translateY(-50%) rotate(90deg)',
    }),
    '& svg': {
      width: '100%',
      height: '100%',
      fill: dropdownBg,
    },
  },
  option: {
    'padding': '10px 20px',
    'borderRadius': '8px',
    'cursor': 'pointer',
    'fontFamily': fontFamily,
    'fontSize': fontSizes.md,
    'fontWeight': fontWeights.semiBold,
    'lineHeight': lineHeights.tight,
    'letterSpacing': letterSpacing.wide,
    'color': isDark ? customColors.white : customColors.textSecondary,
    'transition': 'all 0.2s ease',
    'marginBottom': '2px',
    'minHeight': '42px',
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
