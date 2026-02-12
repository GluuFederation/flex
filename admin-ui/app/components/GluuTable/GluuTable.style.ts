import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS } from '@/constants'
import { hexToRgb } from '@/customColors'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

const EXPAND_BUTTON_SIZE = 28

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
  const expandIconBg = themeColors.table.expandButtonBg
  const expandedBg = isDark
    ? (themeColors.settings?.cardBackground ?? themeColors.card.background)
    : themeColors.lightBackground
  const headerBg = themeColors.table.headerBg
  const headerColor = themeColors.table.headerColor
  const paginationAccent = themeColors.formFooter.back.backgroundColor
  const loadingOverlayBg = `rgba(${hexToRgb(themeColors.background)}, ${isDark ? 0.4 : 0.6})`

  return {
    root: {
      position: 'relative',
    },
    wrapper: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      overflowX: 'hidden',
      borderRadius: BORDER_RADIUS.DEFAULT,
      border: `1px solid ${rowBorder}`,
      backgroundColor: rowBg,
      fontFamily,
    },
    table: {
      width: '100%',
      tableLayout: 'fixed',
      borderCollapse: 'collapse',
      fontSize: fontSizes.base,
    },
    headerCell: {
      backgroundColor: headerBg,
      color: headerColor,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes.base,
      padding: '14px 16px',
      textAlign: 'left',
      borderBottom: `1px solid ${rowBorder}`,
      whiteSpace: 'nowrap',
      userSelect: 'none',
      position: stickyHeader ? 'sticky' : 'relative',
      top: stickyHeader ? 0 : undefined,
      zIndex: stickyHeader ? 1 : undefined,
      lineHeight: '28px',
      verticalAlign: 'middle',
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
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      padding: 0,
      font: 'inherit',
      color: 'inherit',
    },
    sortIconWrap: {
      marginLeft: 4,
      flexShrink: 0,
      display: 'inline-flex',
      flexDirection: 'column',
    },
    cell: {
      padding: '14px 16px',
      color: themeColors.fontColor,
      fontSize: fontSizes.base,
      borderBottom: `1px solid ${rowBorder}`,
      verticalAlign: 'middle',
      lineHeight: '28px',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
      minWidth: 0,
    },
    cellFirst: {
      verticalAlign: 'top',
    },
    cellExpand: {
      width: 40,
      padding: '14px 8px',
      verticalAlign: 'top',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    expandButton: {
      backgroundColor: expandIconBg,
      border: 'none',
      borderRadius: BORDER_RADIUS.CIRCLE,
      cursor: 'pointer',
      padding: '6px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: EXPAND_BUTTON_SIZE,
      height: EXPAND_BUTTON_SIZE,
      boxSizing: 'border-box',
      flexShrink: 0,
    },
    row: {
      'backgroundColor': rowBg,
      'transition': 'background-color 0.15s ease',
      '&:hover': {
        backgroundColor: hoverBg,
      },
    },
    rowExpanded: {
      '& td': {
        borderBottom: 'none',
      },
    },
    expandedPanel: {
      width: '100%',
      boxSizing: 'border-box',
      verticalAlign: 'top',
      backgroundColor: expandedBg,
      padding: '16px 24px',
      borderBottom: 'none',
      boxShadow: `0 1px 0 0 ${rowBorder}`,
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
      minWidth: 0,
    },
    actionsCell: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
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
      '&:hover': { opacity: 0.6 },
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
      padding: '14px 20px',
      border: `1px solid ${rowBorder}`,
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
      '&:focus': {
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
      opacity: 0.4,
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
