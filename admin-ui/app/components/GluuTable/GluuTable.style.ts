import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS } from '@/constants'
import customColors, { hexToRgb } from '@/customColors'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

const LOADING_OVERLAY_BG_DARK = `rgba(${hexToRgb(customColors.black)}, 0.4)`
const LOADING_OVERLAY_BG_LIGHT = `rgba(${hexToRgb(customColors.white)}, 0.6)`

interface GluuTableStyleParams {
  isDark: boolean
  themeColors: ThemeConfig
  stickyHeader: boolean
}

export const useStyles = makeStyles<GluuTableStyleParams>()((
  _,
  { isDark, themeColors, stickyHeader },
) => {
  const rowBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const rowBorder = themeColors.borderColor
  const hoverBg = isDark ? customColors.darkDropdownBg : customColors.lightBackground
  const expandedBg = isDark
    ? (themeColors.settings?.cardBackground ?? themeColors.card.background)
    : themeColors.lightBackground
  const headerBg = isDark ? customColors.darkBackground : customColors.buttonLightBg
  const headerColor = isDark ? customColors.cedarTextTertiaryDark : customColors.textSecondary
  const paginationAccent =
    themeColors.formFooter?.back?.backgroundColor ?? customColors.statusActive

  return {
    root: {
      position: 'relative',
    },
    wrapper: {
      width: '100%',
      overflowX: 'auto',
      borderRadius: BORDER_RADIUS.DEFAULT,
      border: `1px solid ${rowBorder}`,
      backgroundColor: rowBg,
      fontFamily,
    },
    table: {
      width: '100%',
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
    },
    headerCellExpand: {
      width: 40,
      padding: '14px 8px',
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
    },
    cellExpand: {
      width: 40,
      padding: '14px 8px',
    },
    expandButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    row: {
      'backgroundColor': rowBg,
      'transition': 'background-color 0.15s ease',
      '&:hover': {
        backgroundColor: hoverBg,
      },
    },
    expandedPanel: {
      backgroundColor: expandedBg,
      padding: '16px 24px',
      borderBottom: `1px solid ${rowBorder}`,
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
      backgroundColor: isDark ? LOADING_OVERLAY_BG_DARK : LOADING_OVERLAY_BG_LIGHT,
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
    },
    expandIconOpen: {
      transform: 'rotate(90deg)',
    },
  }
})
