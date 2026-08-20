import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'
import {
  SHARED_DROPDOWN_STYLES,
  createBaseOptionStyles,
} from '@/components/GluuDropdown/sharedDropdownStyles'

// Built from the shared dropdown tokens rather than a second set defined here, so this menu is the
// same object as the Theme and language dropdowns in the header. GluuDropdown itself is not used:
// it renders its own trigger, and here the trigger is the date preset button, which lives inside
// the shared DateRangeSelector.
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
      // Grows to the longest label rather than forcing it to wrap, with the shared minimum as a
      // floor so a short set like Daily/All still reads as a menu and not a tooltip.
      width: 'max-content',
      minWidth: SHARED_DROPDOWN_STYLES.minWidth,
      maxHeight: SHARED_DROPDOWN_STYLES.maxHeight,
      // Visible rather than hidden so the arrow, which sits outside the panel, is not clipped.
      overflow: 'visible',
      position: 'relative',
    },
    content: {
      padding: SHARED_DROPDOWN_STYLES.padding,
      maxHeight: SHARED_DROPDOWN_STYLES.maxHeight,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    // Points back at the preset that opened the menu, which is why the panel is centred on it.
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
    // Carries the shared hover and `.selected` treatment, so the highlighted row reads exactly as
    // the selected theme does in the header dropdown. The shared right padding reserves room for a
    // trailing icon this menu does not use, and against two-word labels like "3 Weeks" it forced a
    // line break, so the padding is evened up and wrapping is ruled out outright.
    option: {
      ...createBaseOptionStyles({ isDark, optionPadding: OPTION_PADDING }),
      whiteSpace: 'nowrap' as const,
    },
  }
})
