import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  ICON_SIZE,
  MOBILE_MEDIA_QUERY,
  SPACING,
  createMobilePageTitleStyle,
} from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily } from '@/styles/fonts'

const TREE_WIDTH = 300
const PANE_HEIGHT = 520

export const useStyles = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  return {
    page: {
      fontFamily,
      paddingTop: SPACING.PAGE,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingBottom: `${SPACING.CONTENT_PADDING}px`,
        boxSizing: 'border-box',
      },
    },
    mobilePageTitle: createMobilePageTitleStyle(themeColors.fontColor),
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: SPACING.PAGE,
    },
    toolbarSpacer: { flex: 1 },
    storeName: { color: themeColors.fontColor, fontWeight: 600, fontSize: 15 },
    dirtyNote: {
      color: themeColors.infoAlert.text,
      fontSize: 13,
    },
    splitPane: {
      display: 'flex',
      gap: SPACING.PAGE,
      alignItems: 'stretch',
      [`@media ${MOBILE_MEDIA_QUERY}`]: { flexDirection: 'column' },
    },
    treePane: {
      ...cardBorderStyle,
      width: TREE_WIDTH,
      minWidth: TREE_WIDTH,
      maxHeight: PANE_HEIGHT,
      overflowY: 'auto',
      padding: 8,
      backgroundColor: themeColors.card.background,
      [`@media ${MOBILE_MEDIA_QUERY}`]: { width: '100%', minWidth: 0, maxHeight: 260 },
    },
    viewerPane: {
      ...cardBorderStyle,
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: themeColors.card.background,
    },
    viewerHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: 8,
      borderBottom: `1px solid ${themeColors.borderColor}`,
    },
    viewerPath: {
      color: themeColors.fontColor,
      fontWeight: 500,
      fontSize: 13,
      wordBreak: 'break-all',
      flex: 1,
    },
    viewerBody: { flex: 1, minHeight: PANE_HEIGHT - 60 },
    emptyViewer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: PANE_HEIGHT,
      color: themeColors.fontColor,
      opacity: 0.7,
      fontSize: 14,
      padding: 16,
      textAlign: 'center',
    },
    binaryNotice: {
      padding: 16,
      color: themeColors.fontColor,
      opacity: 0.8,
      fontSize: 13,
    },
    treeRow: {
      'display': 'flex',
      'alignItems': 'center',
      'gap': 6,
      'padding': '4px 6px',
      'borderRadius': BORDER_RADIUS.SMALL,
      'cursor': 'pointer',
      'color': themeColors.fontColor,
      'fontSize': 13,
      'userSelect': 'none',
      '&:hover': { backgroundColor: themeColors.background },
    },
    treeRowSelected: {
      backgroundColor: themeColors.background,
      fontWeight: 600,
    },
    treeRowName: { wordBreak: 'break-all' },
    dirtyDot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: themeColors.infoAlert.text,
      flexShrink: 0,
    },
    treeIcon: { fontSize: ICON_SIZE.SM, opacity: 0.7, flexShrink: 0 },
    actionIcon: { fontSize: ICON_SIZE.SM },
    addFileRow: { display: 'flex', gap: 8, alignItems: 'center', padding: 8, flexWrap: 'wrap' },
    addFileInput: {
      flex: 1,
      minWidth: 180,
      padding: '6px 8px',
      borderRadius: BORDER_RADIUS.SMALL,
      border: `1px solid ${themeColors.borderColor}`,
      backgroundColor: themeColors.background,
      color: themeColors.fontColor,
      fontFamily,
      fontSize: 13,
    },
  }
})
