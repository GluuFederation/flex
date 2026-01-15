import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontSizes } from '@/styles/fonts'
import type { DropdownPosition } from './types'
import { createBaseOptionStyles, SHARED_DROPDOWN_STYLES } from './sharedDropdownStyles'

const getPositionStyles = (position: DropdownPosition) => {
  const baseTransform =
    position === 'top' || position === 'bottom'
      ? { left: '50%', transform: 'translateX(-50%)' }
      : { top: '50%', transform: 'translateY(-50%)' }

  switch (position) {
    case 'top':
      return {
        bottom: '100%',
        marginBottom: SHARED_DROPDOWN_STYLES.margin,
        ...baseTransform,
      }
    case 'bottom':
      return {
        top: '100%',
        marginTop: SHARED_DROPDOWN_STYLES.margin,
        ...baseTransform,
      }
    case 'left':
      return {
        right: '100%',
        marginRight: SHARED_DROPDOWN_STYLES.margin,
        ...baseTransform,
      }
    case 'right':
      return {
        left: '100%',
        marginLeft: SHARED_DROPDOWN_STYLES.margin,
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
        bottom: '-15px',
        left: '50%',
        transform: 'translateX(-50%) rotate(180deg)',
      }
    case 'bottom':
      return {
        top: '-15px',
        left: '50%',
        transform: 'translateX(-50%)',
      }
    case 'left':
      return {
        right: '-15px',
        top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
      }
    case 'right':
      return {
        left: '-15px',
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
  centerText?: boolean
}>()((_theme, { isDark, position, dropdownBg, centerText }) => ({
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
    boxShadow: `0px 4px 11px 0px ${customColors.shadowLight}`,
    padding: 0,
    minWidth: SHARED_DROPDOWN_STYLES.minWidth,
    maxHeight: SHARED_DROPDOWN_STYLES.maxHeight,
    overflow: 'visible',
    ...getPositionStyles(position),
    marginTop: position === 'bottom' ? '13px' : position === 'top' ? undefined : '4px',
  },
  dropdownMenuContent: {
    padding: SHARED_DROPDOWN_STYLES.padding,
    maxHeight: SHARED_DROPDOWN_STYLES.maxHeight,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  arrow: {
    'position': 'absolute',
    'width': SHARED_DROPDOWN_STYLES.arrowWidth,
    'height': SHARED_DROPDOWN_STYLES.arrowHeight,
    'zIndex': SHARED_DROPDOWN_STYLES.arrowZIndex,
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
    'padding': SHARED_DROPDOWN_STYLES.searchPadding,
    'marginBottom': SHARED_DROPDOWN_STYLES.searchMarginBottom,
    'borderRadius': SHARED_DROPDOWN_STYLES.searchBorderRadius,
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
    ...createBaseOptionStyles({
      isDark,
      ...(centerText && { optionPadding: '12px 12px' }),
    }),
    '&.single-option': {
      justifyContent: 'center',
    },
  },
  divider: {
    height: '1px',
    backgroundColor: isDark ? customColors.darkBorder : customColors.lightBorder,
    margin: SHARED_DROPDOWN_STYLES.dividerMargin,
  },
  emptyMessage: {
    padding: SHARED_DROPDOWN_STYLES.emptyMessagePadding,
    textAlign: 'center',
    color: isDark ? customColors.textMutedDark : customColors.textSecondary,
    fontFamily,
    fontSize: fontSizes.sm,
  },
}))
