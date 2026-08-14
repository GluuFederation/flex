import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  EXTRA_SMALL_MAX_MEDIA_QUERY,
  getHoverOpacity,
  getLoadingOverlayOpacity,
  ICON_BUTTON_SIZE,
  ICON_SIZE,
  MOBILE_MEDIA_QUERY,
  OPACITY,
  SPACING,
} from '@/constants'
import customColors, { getLoadingOverlayRgba } from '@/customColors'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

const EXPAND_BUTTON_SIZE = 32
export const TABLE_MIN_WIDTH = 1024
export const TABLE_RESPONSIVE_BREAKPOINT = 1200
export const MOBILE_TABLE_MIN_WIDTH = 560
export const MIN_COL_WIDTH = 60
export const EMPTY_TABLE_ESTIMATE = 15
export const COLUMN_MIN_PCT = 10
export const COLUMN_MAX_PCT = 30
export const AUTO_COL_MIN_PX = 100
export const AUTO_COL_MAX_PX = 520
export const MOBILE_AUTO_COL_MAX_PX = 200
export const AUTO_COL_CHAR_PX = 8
export const AUTO_COL_PADDING_PX = 32

export const DEFAULT_COLUMN_ALIGN = 'center' as const

export const ALIGN_TO_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
} as const

interface GluuTableStyleParams {
  isDark: boolean
  themeColors: ThemeConfig
  stickyHeader: boolean
}

export const useStyles = makeStyles<GluuTableStyleParams>()((
  _,
  { isDark, themeColors, stickyHeader },
) => {
  const rowBg = themeColors.table.background
  const rowBorder = themeColors.borderColor
  const hoverBg = themeColors.background
  const expandButtonBg = themeColors.background
  const expandButtonHoverBg = themeColors.table.expandButtonHoverBg
  const headerBg = themeColors.background
  const headerColor = themeColors.table.headerColor
  const paginationAccent =
    themeColors.formFooter?.back?.backgroundColor ?? customColors.statusActive
  const loadingOverlayBg = getLoadingOverlayRgba(
    themeColors.background,
    getLoadingOverlayOpacity(isDark),
  )

  return {
    root: {
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      // Claw back part of the surrounding card's padding so the table and its
      // pagination row get the full width on narrow screens.
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        marginLeft: -SPACING.CARD_CONTENT_GAP,
        marginRight: -SPACING.CARD_CONTENT_GAP,
        width: `calc(100% + ${SPACING.CARD_CONTENT_GAP * 2}px)`,
        maxWidth: `calc(100% + ${SPACING.CARD_CONTENT_GAP * 2}px)`,
      },
    },
    borderWrapper: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      overflow: 'visible',
    },
    wrapper: {
      'width': '100%',
      'maxWidth': '100%',
      'minWidth': 0,
      'overflowX': 'auto',
      'overflowY': 'visible',
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'backgroundColor': rowBg,
      fontFamily,
      '& table, & table th, & table td': {
        border: 'none !important',
      },
      '& table td[data-divider-cell]': {
        padding: 0,
        lineHeight: 0,
        borderTop: `1px solid ${rowBorder} !important`,
      },
      '& tbody tr [data-expand-button]': {
        backgroundColor: expandButtonBg,
        transition: 'background-color 0.15s ease',
      },
      '& tbody tr:hover [data-expand-button]': {
        backgroundColor: expandButtonHoverBg,
      },
      '& tbody tr [data-expand-button]:hover': {
        backgroundColor: expandButtonHoverBg,
      },
    },
    table: {
      width: '100%',
      tableLayout: 'fixed',
      borderCollapse: 'collapse',
      fontSize: fontSizes.base,
      [`@media (max-width: ${TABLE_RESPONSIVE_BREAKPOINT - 1}px)`]: {
        minWidth: TABLE_MIN_WIDTH,
      },
    },
    headerCell: {
      'backgroundColor': headerBg,
      'color': headerColor,
      'fontWeight': fontWeights.bold,
      'fontSize': fontSizes.base,
      'padding': '14px 16px',
      'textAlign': 'left',
      'whiteSpace': 'nowrap',
      'userSelect': 'none',
      'position': stickyHeader ? 'sticky' : 'relative',
      'top': stickyHeader ? 0 : undefined,
      'zIndex': stickyHeader ? 1 : undefined,
      'lineHeight': '28px',
      'verticalAlign': 'middle',
      '&:hover [data-sort-icon]': {
        opacity: OPACITY.FULL,
      },
    },
    headerCellResizable: {
      paddingRight: 20,
    },
    resizeHandle: {
      'position': 'absolute',
      'top': 0,
      'right': 0,
      'width': 6,
      'height': '100%',
      'cursor': 'col-resize',
      'zIndex': 2,
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 2,
        height: '60%',
        minHeight: 20,
        backgroundColor: rowBorder,
        borderRadius: 1,
        opacity: OPACITY.PLACEHOLDER,
        transition: 'opacity 0.15s ease',
      },
      '&:hover::after': {
        opacity: OPACITY.FULL,
      },
      '&:active::after': {
        opacity: OPACITY.FULL,
      },
    },
    headerCellExpand: {
      width: 72,
      padding: '14px 8px',
      verticalAlign: 'middle',
    },
    headerCellActions: {
      textAlign: 'center',
    },
    headerCellSortable: {
      padding: 0,
    },
    sortableHeader: {
      'cursor': 'pointer',
      'position': 'relative',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'flex-start',
      'width': '100%',
      'padding': '14px 20px',
      'boxSizing': 'border-box',
      'background': 'none',
      'border': 'none',
      'font': 'inherit',
      'lineHeight': '28px',
      'color': headerColor,
      'textAlign': 'inherit',
      '&:hover [data-sort-icon]': {
        opacity: OPACITY.FULL,
      },
    },
    sortableHeaderActive: {
      '& [data-sort-icon]': {
        opacity: OPACITY.FULL,
      },
    },
    sortIconWrap: {
      position: 'absolute',
      right: 16,
      top: '50%',
      marginTop: -7,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      opacity: OPACITY.NONE,
      transformOrigin: 'center',
      transition: 'opacity 0.15s ease, transform 0.2s ease',
    },
    actionIcon: {
      fontSize: fontSizes.md,
    },
    cellCentered: {
      textAlign: 'center' as const,
    },
    cell: {
      padding: '14px 16px',
      color: themeColors.fontColor,
      fontSize: fontSizes.base,
      verticalAlign: 'top',
      lineHeight: '28px',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
      minWidth: 0,
      overflow: 'hidden',
      maxWidth: 0,
    },
    dividerRow: {
      backgroundColor: 'transparent',
    },
    dividerCell: {
      height: 0,
      padding: 0,
      border: 'none',
      lineHeight: 0,
      fontSize: 0,
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    cellFirst: {
      verticalAlign: 'top',
    },
    cellExpand: {
      width: 72,
      minWidth: 72,
      maxWidth: 72,
      padding: '14px 20px 14px 12px',
      verticalAlign: 'top',
      overflow: 'visible',
    },
    cellExpandInner: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    expandButton: {
      'backgroundColor': expandButtonHoverBg,
      'transition': 'background-color 0.15s ease',
      'border': `1px solid ${rowBorder}`,
      'borderRadius': BORDER_RADIUS.CIRCLE,
      'cursor': 'pointer',
      'padding': '6px',
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': EXPAND_BUTTON_SIZE,
      'height': EXPAND_BUTTON_SIZE,
      'minWidth': EXPAND_BUTTON_SIZE,
      'minHeight': EXPAND_BUTTON_SIZE,
      'boxSizing': 'border-box',
      'flexShrink': 0,
      'overflow': 'hidden',
      'font': 'inherit',
      'outline': 'none',
      '&:focus-visible': {
        boxShadow: `0 0 0 2px ${rowBorder}`,
      },
    },
    row: {
      'backgroundColor': rowBg,
      'transition': 'background-color 0.15s ease',
      '&:hover': {
        '& td': {
          backgroundColor: hoverBg,
        },
      },
    },
    expandedPanel: {
      width: '100%',
      boxSizing: 'border-box',
      verticalAlign: 'top',
      backgroundColor: rowBg,
      padding: `${SPACING.CARD_PADDING}px ${SPACING.CARD_PADDING}px`,
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
      minWidth: 0,
    },
    actionsCell: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButton: {
      'background': 'none',
      'border': 'none',
      'cursor': 'pointer',
      'padding': '4px',
      'borderRadius': '4px',
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'color': themeColors.fontColor,
      'transition': 'opacity 0.15s ease',
      '&:hover': { opacity: OPACITY.FULL - getHoverOpacity(isDark) },
      '&:focus': { outline: 'none' },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${paginationAccent}`,
        borderRadius: '4px',
      },
    },
    loadingOverlay: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: loadingOverlayBg,
      zIndex: 10,
      borderRadius: BORDER_RADIUS.DEFAULT,
    },
    paginationBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: `${SPACING.CARD_PADDING}px 20px`,
      borderTop: `1px solid ${rowBorder}`,
      borderBottomLeftRadius: BORDER_RADIUS.DEFAULT,
      borderBottomRightRadius: BORDER_RADIUS.DEFAULT,
      backgroundColor: rowBg,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      color: themeColors.fontColor,
      flexWrap: 'wrap',
      lineHeight: '28px',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        'justifyContent': 'center',
        'flexWrap': 'nowrap',
        'gap': SPACING.CARD_CONTENT_GAP,
        'fontSize': fontSizes.pill,
        'padding': `${SPACING.CARD_BUTTON_GAP}px ${SPACING.CARD_CONTENT_GAP}px`,
        '& > span': {
          whiteSpace: 'nowrap',
          flexShrink: 0,
        },
      },
      [`@media ${EXTRA_SMALL_MAX_MEDIA_QUERY}`]: {
        fontSize: fontSizes.sm,
      },
    },
    paginationSelectWrap: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
    },
    paginationSelect: {
      'background': rowBg,
      'color': themeColors.fontColor,
      'border': 'none',
      'borderRadius': '6px',
      'padding': '8px 24px 8px 12px',
      'minHeight': 40,
      'fontSize': fontSizes.base,
      fontFamily,
      'fontWeight': fontWeights.medium,
      'cursor': 'pointer',
      'appearance': 'none',
      'outline': 'none',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: fontSizes.pill,
        padding: `4px ${SPACING.CARD_PADDING + SPACING.CARD_CONTENT_GAP * 2}px 4px 4px`,
        minHeight: 'auto',
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${paginationAccent}`,
        border: `1px solid ${paginationAccent}`,
      },
    },
    paginationSelectIcon: {
      position: 'absolute',
      right: 6,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    },
    paginationButton: {
      minWidth: 40,
      minHeight: 40,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        minWidth: ICON_BUTTON_SIZE,
        minHeight: ICON_BUTTON_SIZE,
      },
      [`@media ${EXTRA_SMALL_MAX_MEDIA_QUERY}`]: {
        minWidth: ICON_SIZE.LG,
        minHeight: ICON_SIZE.LG,
      },
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      color: paginationAccent,
      transition: 'opacity 0.15s ease',
    },
    paginationButtonDisabled: {
      opacity: OPACITY.DISABLED,
      cursor: 'not-allowed',
      color: themeColors.textMuted,
    },
    paginationNav: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0,
      flexShrink: 0,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        'gap': 0,
        '& > button': {
          minWidth: ICON_SIZE.LG,
          minHeight: ICON_SIZE.LG,
          width: ICON_SIZE.LG,
          height: ICON_SIZE.LG,
          padding: 0,
        },
      },
    },
    emptyRow: {
      textAlign: 'center',
      padding: '40px 16px',
      color: themeColors.textMuted,
      fontSize: fontSizes.base,
    },
    expandIcon: {
      display: 'inline-flex',
      flexShrink: 0,
      transition: 'transform 0.2s ease',
      transform: 'rotate(-90deg)',
    },
    expandIconOpen: {
      transform: 'none',
    },
  }
})
