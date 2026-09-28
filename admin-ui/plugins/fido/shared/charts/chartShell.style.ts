import { makeStyles } from 'tss-react/mui'
import customColors, { getLoadingOverlayRgba, hexToRgb } from '@/customColors'
import {
  BORDER_RADIUS,
  MOBILE_PAGE_PADDING_X,
  MOBILE_QUERY,
  OPACITY,
  SPACING,
  TABLET_MAX_QUERY,
} from '@/constants'
import { SHEET } from '@/components/MobileBottomNav/sheetConstants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { CHART_SCROLLBAR_GUTTER, MODAL_COMPACT_MAX_HEIGHT } from './constants'
import type { ChartStylesParams } from './types'

const MOBILE_CARD_PADDING = 18
const MOBILE_CARD_PADDING_BOTTOM = 10
const CHART_EXPAND_BUTTON_RESERVE = 44
const CHART_HEADER_MAIN_BASIS = 260
const COMPACT_LEGEND_FONT_SIZE = 'clamp(9px, 2.6vw, 12px)'
const COMPACT_LEGEND_GAP = 'clamp(24px, 7vw, 44px)'

const MODAL_OVERLAY_LIGHT = getLoadingOverlayRgba(customColors.black, 0.55)
const MODAL_OVERLAY_DARK = getLoadingOverlayRgba(customColors.black, 0.7)
const MODAL_SHADOW_DARK = `0 24px 64px rgba(${hexToRgb(customColors.black)}, 0.6), 0 12px 32px rgba(${hexToRgb(customColors.black)}, 0.4)`
const MODAL_SHADOW_LIGHT = `0 24px 64px rgba(${hexToRgb(customColors.black)}, 0.25), 0 12px 32px rgba(${hexToRgb(customColors.black)}, 0.15)`

export const getFullscreenCanvasStyle = (isFullscreen: boolean, zoom: number) =>
  isFullscreen
    ? {
        height: `${zoom * 100}%`,
        width: `${zoom * 100}%`,
        flexShrink: 0,
      }
    : undefined

export const getZoomWidthStyle = (isFullscreen: boolean, zoom: number) =>
  isFullscreen ? { width: `${zoom * 100}%` } : undefined

export const useChartShellStyles = makeStyles<ChartStylesParams>()((
  theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  return {
    chartCard: {
      'width': '100%',
      'backgroundColor': cardBg,
      ...cardBorderStyle,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'padding': '24px 28px',
      [MOBILE_QUERY]: {
        padding: `${MOBILE_CARD_PADDING}px ${MOBILE_CARD_PADDING}px ${MOBILE_CARD_PADDING_BOTTOM}px`,
      },
      'boxSizing': 'border-box' as const,
      'height': '100%',
      'position': 'relative' as const,
      '& svg:focus, & svg *:focus': {
        outline: 'none',
      },
    },
    chartCardBody: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
    },
    chartCardHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      columnGap: SPACING.CARD_BUTTON_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      flexWrap: 'wrap' as const,
      minWidth: 0,
      marginBottom: 8,
      [MOBILE_QUERY]: {
        marginBottom: 8,
      },
    },
    chartCardHeaderMain: {
      'flex': `1 1 ${CHART_HEADER_MAIN_BASIS}px`,
      'minWidth': 0,
      '& > :last-child': {
        marginBottom: 0,
      },
    },
    chartCardHeaderExtra: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
      flexWrap: 'wrap' as const,
      minWidth: 0,
      marginRight: CHART_EXPAND_BUTTON_RESERVE,
    },
    chartTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      marginTop: 0,
      marginBottom: 8,
      [MOBILE_QUERY]: {
        fontSize: fontSizes.description,
        fontWeight: fontWeights.semiBold,
        marginBottom: 6,
      },
    },
    chartCaption: {
      textAlign: 'left' as const,
      fontSize: fontSizes.pill,
      marginBottom: 8,
      color: themeColors.fontColor,
      [MOBILE_QUERY]: {
        fontSize: fontSizes.xs,
        marginBottom: 8,
      },
    },
    chartModalCaption: {
      textAlign: 'center' as const,
      fontSize: fontSizes.description,
      marginBottom: 16,
      color: themeColors.fontColor,
    },
    chartExpandButton: {
      'position': 'absolute' as const,
      'top': 12,
      'right': 12,
      'width': 32,
      'height': 32,
      'padding': 0,
      'border': 'none',
      'background': 'transparent',
      'cursor': 'pointer',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'borderRadius': BORDER_RADIUS.SMALL,
      'color': themeColors.fontColor,
      'zIndex': 2,
      '&:hover': {
        backgroundColor: isDark
          ? `rgba(${hexToRgb(customColors.white)}, 0.08)`
          : `rgba(${hexToRgb(customColors.black)}, 0.06)`,
      },
    },
    chartModalOverlay: {
      position: 'fixed' as const,
      inset: 0,
      backgroundColor: isDark ? MODAL_OVERLAY_DARK : MODAL_OVERLAY_LIGHT,
      zIndex: 1040,
      [MOBILE_QUERY]: {
        zIndex: SHEET.Z_BAR_ELEVATED + 1,
      },
      cursor: 'pointer',
      border: 'none',
      padding: 0,
      margin: 0,
    },
    chartModalContainer: {
      ...cardBorderStyle,
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: cardBg,
      borderRadius: BORDER_RADIUS.DEFAULT,
      boxShadow: isDark ? MODAL_SHADOW_DARK : MODAL_SHADOW_LIGHT,
      width: 'min(1400px, 95vw)',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '92vh',
      zIndex: 1050,
      padding: 0,
      boxSizing: 'border-box' as const,
      display: 'flex',
      [TABLET_MAX_QUERY]: {
        width: `calc(100vw - ${MOBILE_PAGE_PADDING_X.MD * 2}px)`,
        maxWidth: `calc(100vw - ${MOBILE_PAGE_PADDING_X.MD * 2}px)`,
        height: 'auto',
        maxHeight: MODAL_COMPACT_MAX_HEIGHT,
        zIndex: SHEET.Z_BAR_ELEVATED + 2,
      },
      [theme.breakpoints.down('sm')]: {
        width: `calc(100vw - ${MOBILE_PAGE_PADDING_X.SM * 2}px)`,
        maxWidth: `calc(100vw - ${MOBILE_PAGE_PADDING_X.SM * 2}px)`,
      },
      flexDirection: 'column' as const,
    },
    chartModalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      [TABLET_MAX_QUERY]: {
        padding: `12px ${MOBILE_CARD_PADDING}px`,
      },
      borderBottom: `1px solid ${themeColors.borderColor}`,
      flexShrink: 0,
    },
    chartModalTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      [TABLET_MAX_QUERY]: {
        fontSize: fontSizes.description,
      },
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      margin: 0,
    },
    chartModalActions: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexShrink: 0,
    },
    chartZoomControls: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      border: `1px solid ${themeColors.borderColor}`,
      borderRadius: BORDER_RADIUS.SMALL,
      padding: 2,
    },
    chartZoomButton: {
      'width': 28,
      'height': 28,
      'padding': 0,
      'border': 'none',
      'background': 'transparent',
      'cursor': 'pointer',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'borderRadius': BORDER_RADIUS.SMALL,
      'color': themeColors.fontColor,
      '&:disabled': {
        opacity: OPACITY.DISABLED,
        cursor: 'not-allowed',
      },
      '&:hover:not(:disabled)': {
        backgroundColor: isDark
          ? `rgba(${hexToRgb(customColors.white)}, 0.08)`
          : `rgba(${hexToRgb(customColors.black)}, 0.06)`,
      },
    },
    chartZoomLevel: {
      'minWidth': 46,
      'height': 28,
      'padding': '0 6px',
      'border': 'none',
      'background': 'transparent',
      'cursor': 'pointer',
      'borderRadius': BORDER_RADIUS.SMALL,
      'fontFamily': fontFamily,
      'fontSize': fontSizes.xs,
      'fontWeight': fontWeights.semiBold,
      'color': themeColors.fontColor,
      '&:hover': {
        backgroundColor: isDark
          ? `rgba(${hexToRgb(customColors.white)}, 0.08)`
          : `rgba(${hexToRgb(customColors.black)}, 0.06)`,
      },
    },
    chartModalCloseButton: {
      'width': 32,
      'height': 32,
      'padding': 0,
      'border': 'none',
      'background': 'transparent',
      'cursor': 'pointer',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'borderRadius': '50%',
      'color': themeColors.fontColor,
      '&:hover': {
        opacity: OPACITY.FULL - OPACITY.DISABLED,
      },
    },
    chartModalBody: {
      flex: '0 1 auto',
      minHeight: 0,
      padding: 24,
      overflow: 'auto' as const,
      overscrollBehavior: 'contain' as const,
      WebkitOverflowScrolling: 'touch' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      [TABLET_MAX_QUERY]: {
        flex: '0 1 auto',
        padding: MOBILE_CARD_PADDING,
      },
    },
    chartLegendWrapper: {
      position: 'relative' as const,
      width: '100%',
      minWidth: 0,
      overflow: 'hidden' as const,
    },
    chartLegendWrapperGutter: {
      paddingTop: CHART_SCROLLBAR_GUTTER,
    },
    chartLegend: {
      display: 'flex',
      flexWrap: 'nowrap' as const,
      justifyContent: 'center',
      alignItems: 'center',
      columnGap: COMPACT_LEGEND_GAP,
      rowGap: 4,
      width: '100%',
      minWidth: 0,
    },
    chartLegendGrid: {
      'display': 'grid',
      'gridTemplateColumns': 'auto auto',
      'justifyContent': 'center',
      'justifyItems': 'start',
      '& > *:nth-of-type(odd):last-child': {
        gridColumn: '1 / -1',
        justifySelf: 'center',
      },
    },
    chartLegendProbe: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      display: 'flex',
      flexWrap: 'nowrap' as const,
      alignItems: 'center',
      columnGap: COMPACT_LEGEND_GAP,
      width: 'max-content',
      visibility: 'hidden' as const,
      pointerEvents: 'none' as const,
    },
    chartLegendItem: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: 8,
      minWidth: 0,
    },
    chartLegendDot: {
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: '50%',
      flexShrink: 0,
    },
    chartLegendDash: {
      display: 'inline-block',
      width: 14,
      height: 4,
      borderRadius: 2,
      flexShrink: 0,
    },
    chartLegendLabel: {
      fontFamily,
      fontSize: COMPACT_LEGEND_FONT_SIZE,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.normal,
      color: themeColors.fontColor,
      whiteSpace: 'nowrap' as const,
    },
  }
})
