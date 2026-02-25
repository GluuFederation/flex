import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, getHoverOpacity, OPACITY, SPACING } from '@/constants'
import customColors, { getLoadingOverlayRgba } from '@/customColors'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

export const EXPAND_BUTTON_SIZE = 32
export const TABLE_MIN_WIDTH = 1280

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
  const hoverBg = themeColors.table.rowHoverBg
  const expandButtonBg = themeColors.table.expandButtonBg
  const expandButtonHoverBg = themeColors.table.expandButtonHoverBg
  const headerBg = themeColors.table.headerBg
  const headerColor = themeColors.table.headerColor
  const paginationAccent =
    themeColors.formFooter?.back?.backgroundColor ?? customColors.statusActive
  const loadingOverlayBg = getLoadingOverlayRgba(themeColors.background, isDark ? 0.4 : 0.6)

  return {
    root: {
      position: 'relative',
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
      },
      // Expand button: default (unhover), row-hover, and icon-hover styles
      '& tbody tr [data-expand-button]': {
        backgroundColor: expandButtonHoverBg,
        transition: 'background-color 0.15s ease',
      },
      '& tbody tr:hover [data-expand-button]': {
        backgroundColor: expandButtonBg,
      },
      '& tbody tr [data-expand-button]:hover': {
        backgroundColor: expandButtonBg,
      },
    },
    table: {
      width: '100%',
      [`@media (max-width: ${TABLE_MIN_WIDTH - 1}px)`]: {
        minWidth: TABLE_MIN_WIDTH,
      },
      tableLayout: 'fixed',
      borderCollapse: 'collapse',
      fontSize: fontSizes.base,
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
        opacity: 1,
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
        opacity: 0.6,
        transition: 'opacity 0.15s ease',
      },
      '&:hover::after': {
        opacity: 1,
      },
      '&:active::after': {
        opacity: 1,
      },
    },
    headerCellExpand: {
      width: 40,
      padding: '14px 8px',
      verticalAlign: 'middle',
    },
    headerCellActions: {
      textAlign: 'center',
    },
    sortableHeader: {
      'cursor': 'pointer',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'flex-start',
      'position': 'absolute',
      'left': 0,
      'top': 0,
      'right': 6,
      'bottom': 0,
      'width': 'auto',
      'padding': '14px 16px',
      'background': 'none',
      'border': 'none',
      'font': 'inherit',
      'color': headerColor,
      'textAlign': 'inherit',
      '&:hover [data-sort-icon]': {
        opacity: 1,
      },
    },
    sortableHeaderActive: {
      '& [data-sort-icon]': {
        opacity: 1,
      },
    },
    sortIconWrap: {
      marginLeft: 10,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      opacity: 0,
      transition: 'opacity 0.15s ease',
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
      width: 40,
      padding: '14px 8px',
      verticalAlign: 'top',
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
      'boxShadow': `0 0 0 1px ${rowBorder}`,
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
        '& td:first-of-type': {
          borderTopLeftRadius: BORDER_RADIUS.SMALL_MEDIUM,
          borderBottomLeftRadius: BORDER_RADIUS.SMALL_MEDIUM,
        },
        '& td:last-of-type': {
          borderTopRightRadius: BORDER_RADIUS.SMALL_MEDIUM,
          borderBottomRightRadius: BORDER_RADIUS.SMALL_MEDIUM,
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
      alignItems: 'flex-start',
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
      '&:hover': { opacity: 1 - getHoverOpacity(isDark) },
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
