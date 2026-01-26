import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'
import type { DropdownPosition } from '../GluuDropdown/types'
import {
  createBaseOptionStyles,
  SHARED_DROPDOWN_STYLES,
} from '../GluuDropdown/sharedDropdownStyles'

const getPositionStyles = (position: DropdownPosition) => {
  switch (position) {
    case 'top':
      return {
        bottom: '100%',
        marginBottom: SHARED_DROPDOWN_STYLES.margin,
      }
    case 'bottom':
      return {
        top: '100%',
        marginTop: SHARED_DROPDOWN_STYLES.margin,
      }
    case 'left':
      return {
        right: '100%',
        marginRight: SHARED_DROPDOWN_STYLES.margin,
      }
    case 'right':
      return {
        left: '100%',
        marginLeft: SHARED_DROPDOWN_STYLES.margin,
      }
    default:
      return {}
  }
}

const getArrowStyles = (position: DropdownPosition) => {
  const baseStyles = {
    position: 'absolute' as const,
    width: SHARED_DROPDOWN_STYLES.arrowWidth,
    height: SHARED_DROPDOWN_STYLES.arrowHeight,
  }

  switch (position) {
    case 'top':
      return {
        ...baseStyles,
        bottom: `-${SHARED_DROPDOWN_STYLES.margin}`,
        left: '50%',
        transform: 'translateX(-50%)',
      }
    case 'bottom':
      return {
        ...baseStyles,
        top: `-${SHARED_DROPDOWN_STYLES.margin}`,
        left: '50%',
        transform: 'translateX(-50%) rotate(180deg)',
      }
    case 'left':
      return {
        ...baseStyles,
        right: `-${SHARED_DROPDOWN_STYLES.margin}`,
        top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
      }
    case 'right':
      return {
        ...baseStyles,
        left: `-${SHARED_DROPDOWN_STYLES.margin}`,
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
}>()((_, { isDark, position, dropdownBg }) => ({
  dropdownWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownMenu: {
    position: 'absolute',
    zIndex: SHARED_DROPDOWN_STYLES.menuZIndex,
    backgroundColor: dropdownBg,
    border: 'none',
    borderRadius: SHARED_DROPDOWN_STYLES.borderRadius,
    boxShadow: `0px 4px 11px 0px rgba(${hexToRgb(customColors.black)}, 0.05)`,
    padding: '22px 20px',
    minWidth: SHARED_DROPDOWN_STYLES.minWidth,
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
    ...createBaseOptionStyles({
      isDark,
      optionPadding: '10px 20px',
      optionBorderRadius: '8px',
    }),
    '&.disabled': {
      pointerEvents: 'none',
    },
  },
}))
