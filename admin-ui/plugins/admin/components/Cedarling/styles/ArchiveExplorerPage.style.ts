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
import { fontFamily, fontSizes, fontWeights, letterSpacing } from '@/styles/fonts'

const TREE_WIDTH = 300
const PANE_MIN_HEIGHT = 320
const SPLIT_PANE_HEIGHT = '65vh'
const PANE_HEADER_PADDING = '10px 12px'
export const PANE_BODY_PADDING = 8
const TREE_ROW_HEIGHT = 32
const SELECTED_ROW_ACCENT_WIDTH = 2

export const useStyles = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const paneHeaderFont = {
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacing.loose,
  }

  const paneHeader = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 8,
    padding: PANE_HEADER_PADDING,
    borderBottom: `1px solid ${themeColors.borderColor}`,
    backgroundColor: themeColors.background,
  }

  return {
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

    storeName: {
      fontFamily,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: themeColors.fontColor,
      display: 'block',
      marginBottom: SPACING.CARD_GAP,
      wordBreak: 'break-word',
    },

    paneHeader,
    paneTitle: {
      ...paneHeaderFont,
      color: themeColors.fontColor,
    },
    paneCount: {
      ...paneHeaderFont,
      color: themeColors.fontColor,
      marginLeft: 'auto',
    },

    splitPane: {
      display: 'flex',
      gap: SPACING.PAGE,
      alignItems: 'stretch',
      height: SPLIT_PANE_HEIGHT,
      minHeight: PANE_MIN_HEIGHT,
      [`@media ${MOBILE_MEDIA_QUERY}`]: { flexDirection: 'column', height: 'auto' },
    },
    treePane: {
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      backgroundColor: cardBg,
      width: TREE_WIDTH,
      minWidth: TREE_WIDTH,
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: { width: '100%', minWidth: 0, maxHeight: 300 },
    },
    treeScroll: {
      flex: 1,
      overflowY: 'auto',
      padding: PANE_BODY_PADDING,
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
    viewerHeader: { ...paneHeader, flexWrap: 'wrap' },
    viewerPath: {
      flex: 1,
      minWidth: 160,
      display: 'flex',
      alignItems: 'baseline',
      gap: 2,
      flexWrap: 'wrap',
    },
    viewerDir: {
      ...paneHeaderFont,
      'color': themeColors.fontColor,
      'display': 'inline-block',
      'wordBreak': 'break-all',
      '&::first-letter': { textTransform: 'uppercase' },
    },
    viewerFile: {
      ...paneHeaderFont,
      color: themeColors.fontColor,
      wordBreak: 'break-all',
    },
    viewerBody: { flex: 1, minHeight: 0 },
    emptyViewer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      minHeight: 0,
      padding: 16,
      textAlign: 'center',
      fontFamily,
      fontSize: fontSizes.base,
      color: themeColors.textMuted,
    },
    binaryNotice: {
      padding: 16,
      fontFamily,
      fontSize: fontSizes.base,
      color: themeColors.fontColor,
    },
    viewerUnsavedNote: {
      ...paneHeaderFont,
      fontWeight: fontWeights.regular,
      color: themeColors.fontColor,
      marginLeft: 8,
    },
    viewerNotice: {
      ...paneHeaderFont,
      color: themeColors.textMuted,
      width: '100%',
    },

    treeRow: {
      'display': 'flex',
      'alignItems': 'center',
      'gap': 8,
      'padding': '6px 8px',
      'minHeight': TREE_ROW_HEIGHT,
      'borderRadius': BORDER_RADIUS.SMALL,
      'cursor': 'pointer',
      'fontFamily': fontFamily,
      'fontSize': fontSizes.base,
      'color': themeColors.fontColor,
      'userSelect': 'none',
      'transition': 'background-color 0.12s ease',
      '&:hover': { backgroundColor: themeColors.background },
    },
    treeRowSelected: {
      backgroundColor: themeColors.background,
      fontWeight: fontWeights.bold,
      boxShadow: `inset ${SELECTED_ROW_ACCENT_WIDTH}px 0 0 ${themeColors.badges.filledBadgeBg}`,
    },
    treeRowName: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    treeIcon: { fontSize: ICON_SIZE.SM, flexShrink: 0 },
    treeFileIcon: { fontSize: ICON_SIZE.SM, flexShrink: 0, color: themeColors.textMuted },
    footer: { marginTop: SPACING.PAGE },
  }
})
