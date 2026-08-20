import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'
import {
  SHARED_DROPDOWN_STYLES,
  createBaseOptionStyles,
} from '@/components/GluuDropdown/sharedDropdownStyles'

const OPTION_PADDING = '12px 16px'

export const useGranularityMenuStyles = makeStyles<{ isDark: boolean }>()((_theme, { isDark }) => {
  const dropdownBg = isDark ? customColors.darkDropdownBg : customColors.white

  return {
    menu: {
      backgroundColor: dropdownBg,
      border: 'none',
      borderRadius: SHARED_DROPDOWN_STYLES.borderRadius,
      boxShadow: `0px 4px 11px 0px rgba(${hexToRgb(customColors.black)}, 0.05)`,
      padding: 0,
      width: 'max-content',
      minWidth: SHARED_DROPDOWN_STYLES.minWidth,
      maxHeight: SHARED_DROPDOWN_STYLES.maxHeight,
      overflow: 'visible',
      position: 'relative',
    },
    content: {
      padding: SHARED_DROPDOWN_STYLES.padding,
      maxHeight: SHARED_DROPDOWN_STYLES.maxHeight,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    arrow: {
      'position': 'absolute',
      'top': '-15px',
      'left': '50%',
      'transform': 'translateX(-50%)',
      'width': SHARED_DROPDOWN_STYLES.arrowWidth,
      'height': SHARED_DROPDOWN_STYLES.arrowHeight,
      'zIndex': SHARED_DROPDOWN_STYLES.arrowZIndex,
      'pointerEvents': 'none',
      '& svg': {
        width: '100%',
        height: '100%',
        fill: dropdownBg,
        color: dropdownBg,
        filter: `drop-shadow(0px -1px 2px rgba(${hexToRgb(customColors.black)}, 0.1))`,
      },
    },
    option: {
      ...createBaseOptionStyles({ isDark, optionPadding: OPTION_PADDING }),
      whiteSpace: 'nowrap' as const,
    },
  }
})
