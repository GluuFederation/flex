import { makeStyles } from 'tss-react/mui'
import { hexToRgb } from '@/customColors'
import { fontFamily, fontWeights, fontSizes } from '@/styles/fonts'
import { BOTTOM_NAV } from './constants'
import { SHEET } from './sheetConstants'
import type { MobileBottomNavThemeColors } from './types'

const useStyles = makeStyles<{ colors: MobileBottomNavThemeColors }>()((_theme, { colors }) => ({
  root: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: BOTTOM_NAV.Z_ROOT,
    display: 'flex',
    alignItems: 'stretch',
    height: BOTTOM_NAV.HEIGHT,
    padding: `0 ${BOTTOM_NAV.PADDING_X}px`,
    backgroundColor: colors.background,
    borderTop: `1px solid ${colors.border}`,
    boxShadow: `0px ${BOTTOM_NAV.SHADOW_OFFSET_Y}px ${BOTTOM_NAV.SHADOW_BLUR}px 0px rgba(${hexToRgb(colors.shadow)}, ${BOTTOM_NAV.SHADOW_OPACITY})`,
    paddingBottom: 'env(safe-area-inset-bottom)',
    boxSizing: 'border-box',
  },
  rootElevated: {
    zIndex: SHEET.Z_BAR_ELEVATED,
    boxShadow: 'none',
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: BOTTOM_NAV.TAB_GAP,
    minWidth: 0,
    padding: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    position: 'relative',
    color: colors.inactive,
    minHeight: BOTTOM_NAV.TAB_MIN_HEIGHT,
  },
  tabActive: {
    color: colors.active,
  },
  iconWrap: {
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'width': BOTTOM_NAV.ICON_SIZE,
    'height': BOTTOM_NAV.ICON_SIZE,
    '& svg': {
      width: BOTTOM_NAV.ICON_SIZE,
      height: BOTTOM_NAV.ICON_SIZE,
    },
  },
  label: {
    fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: BOTTOM_NAV.ACTIVE_INDICATOR_WIDTH,
    height: BOTTOM_NAV.ACTIVE_INDICATOR_HEIGHT,
    borderRadius: BOTTOM_NAV.ACTIVE_INDICATOR_HEIGHT,
    backgroundColor: colors.active,
  },
}))

export { useStyles }
