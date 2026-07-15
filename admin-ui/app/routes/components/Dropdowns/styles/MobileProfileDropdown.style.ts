import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontWeights, fontSizes } from '@/styles/fonts'
import customColors, { hexToRgb } from '@/customColors'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK, type ThemeValue } from '@/context/theme/constants'

type StyleParams = {
  theme: ThemeValue
}

const MENU_SHADOW_OPACITY = 0.05
const MENU_SHADOW = `0px 4px 5.5px rgba(${hexToRgb(customColors.black)}, ${MENU_SHADOW_OPACITY})`
const MENU_TRANSITION_MS = 300

export const useStyles = makeStyles<StyleParams>()((_theme, { theme }) => {
  const tc = getThemeColor(theme)
  const isDark = theme === THEME_DARK
  const controlTextColor = isDark ? customColors.white : customColors.textSecondary
  const chipBg = isDark
    ? customColors.mobileSheetTileChipDark
    : customColors.mobileSheetTileChipLight

  return {
    container: {
      position: 'relative',
    },
    triggerButton: {
      cursor: 'pointer',
    },
    menu: {
      position: 'absolute',
      right: 0,
      top: 'calc(100% + 8px)',
      zIndex: 1200,
      width: 200,
      boxSizing: 'border-box',
      backgroundColor: tc.menu.background,
      border: `1.5px solid ${tc.borderColor}`,
      borderRadius: 10,
      boxShadow: MENU_SHADOW,
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      transformOrigin: 'top right',
      opacity: 0,
      transform: 'translateY(-8px) scale(0.96)',
      transition: `opacity ${MENU_TRANSITION_MS}ms ease, transform ${MENU_TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
      willChange: 'opacity, transform',
    },
    menuOpen: {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 30,
    },
    rowLabel: {
      fontFamily,
      fontSize: fontSizes.description,
      fontWeight: fontWeights.semiBold,
      lineHeight: 'normal',
      letterSpacing: '0.22px',
      color: tc.menu.color,
      margin: 0,
      whiteSpace: 'nowrap',
    },
    profileRow: {
      cursor: 'pointer',
    },
    arrowButton: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      backgroundColor: chipBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: tc.menu.color,
    },
    arrowIcon: {
      width: 12,
      height: 12,
      display: 'block',
    },
    divider: {
      height: 0,
      border: 'none',
      borderTop: `1px solid ${tc.borderColor}`,
      margin: '12px 0',
      width: '100%',
    },
    control: {
      minWidth: 86,
      height: 30,
      boxSizing: 'border-box',
      border: `1px solid ${tc.settings.inputBorder}`,
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 8px',
      cursor: 'pointer',
      gap: 4,
    },
    controlText: {
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      lineHeight: '21.6px',
      color: controlTextColor,
      whiteSpace: 'nowrap',
    },
    controlIcon: {
      'width': 10,
      'height': 10,
      'flexShrink': 0,
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'color': controlTextColor,
      '& svg': {
        width: '100%',
        height: '100%',
      },
    },
    signOut: {
      marginTop: 12,
      height: 36,
      borderRadius: 3,
      backgroundColor: chipBg,
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      width: '100%',
      padding: 0,
    },
    signOutText: {
      fontFamily,
      fontSize: fontSizes.description,
      fontWeight: fontWeights.semiBold,
      lineHeight: '22.273px',
      color: tc.menu.color,
      whiteSpace: 'nowrap',
    },
    compactMenu: {
      'minWidth': '96px !important',
      'width': 'auto',
      'left': 'auto !important',
      'right': '0 !important',
      'transform': 'none !important',
      'marginTop': '4px !important',
      '& [role="option"]': {
        minHeight: 'auto',
        marginBottom: '2px',
        padding: '6px 9px',
        fontSize: fontSizes.sm,
        lineHeight: '16px',
        borderRadius: 4,
      },
      '& > div': {
        padding: '6px',
      },
    },
  }
})
