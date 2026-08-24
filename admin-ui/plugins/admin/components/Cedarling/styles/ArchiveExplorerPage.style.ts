import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  ICON_SIZE,
  MOBILE_MEDIA_QUERY,
  MOBILE_PAGE_PADDING_X,
  OPACITY,
  SPACING,
  createMobilePageTitleStyle,
} from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily, fontSizes, fontWeights, letterSpacing } from '@/styles/fonts'

const PANE_MIN_HEIGHT = 320
const SPLIT_PANE_HEIGHT = '65vh'
const PANE_HEADER_PADDING = '10px 12px'
const PANE_HEADER_MIN_HEIGHT = 56
export const PANE_BODY_PADDING = 8
const TREE_ROW_HEIGHT = 32
const PANE_ACTION_SIZE = 34
const SPLITTER_WIDTH = 12
const SPLITTER_GRIP_WIDTH = 3
const SPLITTER_GRIP_HEIGHT = 36
const SELECTED_ROW_ACCENT_WIDTH = 2
const TREE_ROW_ACTION_SIZE = 24
const HEADER_ICON_SIZE = 26
const HEADER_ICON_WIDE = 24
export const TREE_ROW_ACTIONS_CLASS = 'archive-tree-row-actions'

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
    minHeight: PANE_HEADER_MIN_HEIGHT,
    boxSizing: 'border-box' as const,
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
    },
    paneActions: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginLeft: 'auto',
    },

    splitPane: {
      display: 'flex',
      alignItems: 'stretch',
      height: SPLIT_PANE_HEIGHT,
      minHeight: PANE_MIN_HEIGHT,
      [`@media ${MOBILE_MEDIA_QUERY}`]: { flexDirection: 'column', height: 'auto' },
    },
    treePane: {
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      backgroundColor: cardBg,
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: { width: '100%', minWidth: 0, maxHeight: 300 },
    },
    splitter: {
      'flexShrink': 0,
      'width': SPLITTER_WIDTH,
      'padding': 0,
      'border': 'none',
      'background': 'none',
      'cursor': 'ew-resize',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'touchAction': 'none',
      '&:hover span, &:focus-visible span': { backgroundColor: themeColors.textMuted },
      [`@media ${MOBILE_MEDIA_QUERY}`]: { display: 'none' },
    },
    splitterGrip: {
      width: SPLITTER_GRIP_WIDTH,
      height: SPLITTER_GRIP_HEIGHT,
      borderRadius: SPLITTER_GRIP_WIDTH,
      backgroundColor: themeColors.borderColor,
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
    paneAction: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': PANE_ACTION_SIZE,
      'height': PANE_ACTION_SIZE,
      'flexShrink': 0,
      'padding': 0,
      'border': 'none',
      'borderRadius': BORDER_RADIUS.SMALL,
      'background': 'none',
      'color': themeColors.fontColor,
      'cursor': 'pointer',
      'lineHeight': 0,
      '&:hover': { backgroundColor: themeColors.borderColor },
      '&:focus-visible': { outline: `1px solid ${themeColors.borderColor}` },
    },
    paneActionIcon: { fontSize: ICON_SIZE.SM },
    headerActionIcon: {
      width: HEADER_ICON_SIZE,
      height: HEADER_ICON_SIZE,
      fontSize: HEADER_ICON_SIZE,
    },
    headerActionIconWide: {
      width: HEADER_ICON_WIDE,
      height: HEADER_ICON_WIDE,
      fontSize: HEADER_ICON_WIDE,
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
      [`&:hover .${TREE_ROW_ACTIONS_CLASS}, &:focus-within .${TREE_ROW_ACTIONS_CLASS}`]: {
        opacity: OPACITY.FULL,
      },
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
    treeRowCount: {
      flexShrink: 0,
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.regular,
      color: themeColors.textMuted,
    },
    treeRowActions: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      flexShrink: 0,
      marginLeft: 'auto',
      opacity: OPACITY.NONE,
      transition: 'opacity 0.12s ease',
    },
    treeRowAction: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': TREE_ROW_ACTION_SIZE,
      'height': TREE_ROW_ACTION_SIZE,
      'padding': 0,
      'border': 'none',
      'borderRadius': BORDER_RADIUS.SMALL,
      'background': 'none',
      'color': themeColors.fontColor,
      'cursor': 'pointer',
      'lineHeight': 0,
      '&:hover': { backgroundColor: themeColors.borderColor },
      '&:focus-visible': { outline: `1px solid ${themeColors.borderColor}` },
    },
    treeSectionLabel: {
      display: 'block',
      padding: '12px 8px 4px',
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.loose,
      textTransform: 'uppercase',
      color: themeColors.textMuted,
    },
    treeIcon: { fontSize: ICON_SIZE.SM, flexShrink: 0 },
    treeFileIcon: { fontSize: ICON_SIZE.SM, flexShrink: 0, color: themeColors.textMuted },
    footer: { marginTop: SPACING.PAGE },
  }
})
