import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  ICON_SIZE,
  MOBILE_MEDIA_QUERY,
  MOBILE_PAGE_PADDING_X,
  SPACING,
  createMobilePageTitleStyle,
} from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { createInfoAlertStyles } from '@/styles/formStyles'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

const TREE_WIDTH = 300
const PANE_HEIGHT = 520
const EDITOR_PANE_HEIGHT = PANE_HEIGHT - 60

export const useStyles = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  return {
    // Matches the sibling Cedarling Configuration page so both screens share one page shell.
    mobileContentPad: {
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingLeft: `${MOBILE_PAGE_PADDING_X.MD}px`,
        paddingRight: `${MOBILE_PAGE_PADDING_X.MD}px`,
        marginTop: `-${SPACING.PAGE / 2}px`,
        boxSizing: 'border-box',
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: `${MOBILE_PAGE_PADDING_X.SM}px`,
        paddingRight: `${MOBILE_PAGE_PADDING_X.SM}px`,
      },
    },
    mobilePageTitle: createMobilePageTitleStyle(themeColors.fontColor),

    ...createInfoAlertStyles(themeColors.infoAlert),
    infoAlertTopAligned: { alignItems: 'flex-start', marginBottom: SPACING.CARD_GAP },

    storeName: {
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.bold,
      color: themeColors.fontColor,
      marginBottom: SPACING.CARD_GAP,
      display: 'block',
      wordBreak: 'break-word',
    },

    splitPane: {
      display: 'flex',
      gap: SPACING.PAGE,
      alignItems: 'stretch',
      [`@media ${MOBILE_MEDIA_QUERY}`]: { flexDirection: 'column' },
    },
    treePane: {
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      backgroundColor: cardBg,
      width: TREE_WIDTH,
      minWidth: TREE_WIDTH,
      maxHeight: PANE_HEIGHT,
      overflowY: 'auto',
      padding: 12,
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: { width: '100%', minWidth: 0, maxHeight: 260 },
    },
    viewerPane: {
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      backgroundColor: cardBg,
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    viewerHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      padding: 12,
      borderBottom: `1px solid ${themeColors.borderColor}`,
    },
    viewerPath: {
      flex: 1,
      minWidth: 160,
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      color: themeColors.fontColor,
      wordBreak: 'break-all',
    },
    viewerBody: { flex: 1, minHeight: EDITOR_PANE_HEIGHT },
    emptyViewer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: PANE_HEIGHT,
      padding: 16,
      textAlign: 'center',
      fontFamily,
      fontSize: fontSizes.base,
      color: themeColors.fontColor,
    },
    binaryNotice: {
      padding: 16,
      fontFamily,
      fontSize: fontSizes.base,
      color: themeColors.fontColor,
    },

    treeRow: {
      'display': 'flex',
      'alignItems': 'center',
      'gap': 6,
      'padding': '4px 6px',
      'borderRadius': BORDER_RADIUS.SMALL,
      'cursor': 'pointer',
      'fontFamily': fontFamily,
      'fontSize': fontSizes.base,
      'color': themeColors.fontColor,
      'userSelect': 'none',
      '&:hover': { backgroundColor: themeColors.background },
    },
    treeRowSelected: {
      backgroundColor: themeColors.background,
      fontWeight: fontWeights.bold,
    },
    treeRowName: { wordBreak: 'break-all' },
    dirtyDot: {
      width: 8,
      height: 8,
      borderRadius: BORDER_RADIUS.CIRCLE,
      backgroundColor: themeColors.infoAlert.icon,
      flexShrink: 0,
    },
    treeIcon: { fontSize: ICON_SIZE.SM, flexShrink: 0 },
    actionIcon: { fontSize: ICON_SIZE.SM },

    addFileRow: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: SPACING.CARD_GAP,
    },
    addFileInput: {
      flex: 1,
      minWidth: 180,
      padding: '8px 12px',
      borderRadius: BORDER_RADIUS.SMALL,
      border: `1px solid ${themeColors.borderColor}`,
      backgroundColor: themeColors.settings?.formInputBackground ?? themeColors.inputBackground,
      color: themeColors.fontColor,
      fontFamily,
      fontSize: fontSizes.base,
    },
    footer: { marginTop: SPACING.PAGE },
  }
})
