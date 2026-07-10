import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontWeights } from '@/styles/fonts'
import customColors from '@/customColors'

type StyleParams = {
  isDark: boolean
}

// Colors taken directly from the Figma dropdown spec (nodes 3755:1350 light /
// 3755:1671 dark). Kept local to this component because they are dropdown-only
// tokens that do not exist in the shared theme config.
const LIGHT = {
  bg: customColors.white,
  border: '#cfcfcf',
  divider: '#c7c7c7',
  text: '#0a2540',
  controlBorder: '#ebebeb',
  controlText: '#425466',
  signOutBg: '#f5f6f8',
  arrowBg: '#f5f6f8',
} as const

const DARK = {
  bg: '#0a2540',
  border: '#3a628c',
  divider: '#4a72a0',
  text: customColors.white,
  controlBorder: '#193f66',
  controlText: customColors.white,
  signOutBg: '#16395d',
  arrowBg: '#16395d',
} as const

export const useStyles = makeStyles<StyleParams>()((_theme, { isDark }) => {
  const c = isDark ? DARK : LIGHT

  return {
    menu: {
      width: 172,
      boxSizing: 'border-box',
      backgroundColor: c.bg,
      border: `1.5px solid ${c.border}`,
      borderRadius: 10,
      boxShadow: '0px 4px 5.5px rgba(0, 0, 0, 0.05)',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 27,
    },
    rowLabel: {
      fontFamily,
      fontSize: '13px',
      fontWeight: fontWeights.semiBold,
      lineHeight: 'normal',
      letterSpacing: '0.22px',
      color: c.text,
      margin: 0,
      whiteSpace: 'nowrap',
    },
    profileRow: {
      cursor: 'pointer',
    },
    arrowButton: {
      width: 20,
      height: 21,
      borderRadius: '50%',
      backgroundColor: c.arrowBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: c.text,
    },
    arrowIcon: {
      width: 10,
      height: 10,
      display: 'block',
    },
    divider: {
      height: 0,
      border: 'none',
      borderTop: `1px solid ${c.divider}`,
      margin: '12px 0',
      width: '100%',
    },
    control: {
      minWidth: 74,
      height: 27,
      boxSizing: 'border-box',
      border: `1px solid ${c.controlBorder}`,
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 6px',
      cursor: 'pointer',
      gap: 4,
    },
    controlText: {
      fontFamily,
      fontSize: '12px',
      fontWeight: fontWeights.medium,
      lineHeight: '21.6px',
      color: c.controlText,
      whiteSpace: 'nowrap',
    },
    controlIcon: {
      'width': 8,
      'height': 8,
      'flexShrink': 0,
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'color': c.controlText,
      '& svg': {
        width: '100%',
        height: '100%',
      },
    },
    signOut: {
      marginTop: 12,
      height: 32,
      borderRadius: 3,
      backgroundColor: c.signOutBg,
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
      fontSize: '13px',
      fontWeight: fontWeights.semiBold,
      lineHeight: '22.273px',
      color: c.text,
      whiteSpace: 'nowrap',
    },
    // Shrinks the nested GluuDropdown option panel (theme/language selectors)
    // so its list matches the compact 50x27 control instead of the default
    // full-size dropdown rows. Applied via `dropdownClassName`.
    compactMenu: {
      'minWidth': '96px !important',
      'width': 'auto',
      // Attach the list directly below the control, aligned to its right edge
      // (the control sits at the right of its row). Override GluuDropdown's
      // default centered + 13px-gap positioning.
      'left': 'auto !important',
      'right': '0 !important',
      'transform': 'none !important',
      'marginTop': '4px !important',
      '& [role="option"]': {
        minHeight: 'auto',
        marginBottom: '2px',
        padding: '6px 9px',
        fontSize: '12px',
        lineHeight: '16px',
        borderRadius: 4,
      },
      // Tighten the menu content padding (default 16px) to match the compact rows.
      '& > div': {
        padding: '6px',
      },
    },
  }
})
