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
import {
  createFormInputStyles,
  createFormInputFocusStyles,
  createFormInputPlaceholderStyles,
  createInfoAlertStyles,
} from '@/styles/formStyles'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

const TREE_WIDTH = 300
const PANE_HEIGHT = 520
const EDITOR_PANE_HEIGHT = PANE_HEIGHT - 60
const PANE_HEADER_PADDING = '10px 12px'
const TREE_ROW_HEIGHT = 32
const SELECTED_ROW_ACCENT_WIDTH = 2
const DIRTY_DOT_SIZE = 8

export const useStyles = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputColors = {
    inputBg: themeColors.settings?.formInputBackground ?? themeColors.inputBackground,
    inputBorderColor: themeColors.borderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
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

    ...createInfoAlertStyles(themeColors.infoAlert),
    infoAlertTopAligned: { alignItems: 'flex-start', marginBottom: SPACING.CARD_GAP },

    storeHeader: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      marginBottom: SPACING.CARD_GAP,
    },
    storeName: {
      fontFamily,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      color: themeColors.fontColor,
      display: 'block',
      wordBreak: 'break-word',
    },
    storeMeta: {
      fontFamily,
      fontSize: fontSizes.sm,
      color: themeColors.textMuted,
      display: 'block',
    },

    paneHeader,
    paneTitle: {
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.bold,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: themeColors.textMuted,
    },
    paneCount: {
      fontFamily,
      fontSize: fontSizes.sm,
      color: themeColors.textMuted,
      marginLeft: 'auto',
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
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: { width: '100%', minWidth: 0, maxHeight: 300 },
    },
    treeScroll: {
      flex: 1,
      overflowY: 'auto',
      padding: 8,
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
      fontFamily,
      fontSize: fontSizes.sm,
      color: themeColors.textMuted,
      wordBreak: 'break-all',
    },
    viewerFile: {
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.bold,
      color: themeColors.fontColor,
      wordBreak: 'break-all',
    },
    viewerSize: {
      fontFamily,
      fontSize: fontSizes.sm,
      color: themeColors.textMuted,
      flexShrink: 0,
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
      color: themeColors.textMuted,
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
    dirtyDot: {
      width: DIRTY_DOT_SIZE,
      height: DIRTY_DOT_SIZE,
      borderRadius: BORDER_RADIUS.CIRCLE,
      backgroundColor: themeColors.infoAlert.icon,
      flexShrink: 0,
    },
    treeIcon: { fontSize: ICON_SIZE.SM, flexShrink: 0 },
    treeFileIcon: { fontSize: ICON_SIZE.SM, flexShrink: 0, color: themeColors.textMuted },
    actionIcon: { fontSize: ICON_SIZE.SM },

    addFileRow: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: SPACING.CARD_GAP,
    },
    addFileInput: {
      ...createFormInputStyles(inputColors),
      'flex': 1,
      'minWidth': 180,
      'fontFamily': fontFamily,
      'fontSize': fontSizes.base,
      '&:focus': createFormInputFocusStyles(inputColors),
      '&::placeholder': createFormInputPlaceholderStyles(themeColors.textMuted),
    },
    footer: { marginTop: SPACING.PAGE },
  }
})
