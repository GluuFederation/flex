import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'
import {
  BORDER_RADIUS,
  createMobilePageTitleStyle,
  FILTER_SHEET,
  getScrollbarStyles,
  ICON_SIZE,
  KPI_DELTA_BADGE,
  MOBILE_QUERY,
  OPACITY,
  SEGMENTED_CONTROL,
  SPACING,
  SUMMARY_CARD,
  TABLET_MAX_QUERY,
  WIDE_MAX_QUERY,
} from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { CHART_EMPTY_INSET } from './constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { SecurityStylesParams } from './types'
import {
  CHART_HEIGHT,
  CHART_SCROLLBAR_GUTTER,
  getCompactFullscreenFrameHeight,
} from 'Plugins/fido/shared/charts'

const SCROLLBAR_THUMB_INSET = 3
const MOBILE_VELOCITY_CELL_MIN_WIDTH = 44
const MOBILE_VELOCITY_LABEL_WIDTH = 120
const FULLSCREEN_FRAME_COMPACT_HEIGHT = getCompactFullscreenFrameHeight(CHART_HEIGHT.MOBILE)

const KPI_VALUE_UNIT_GAP = 2

const useSecurityStyles = makeStyles<SecurityStylesParams>()((_, { isDark, themeColors }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  return {
    pageHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPACING.CARD_BUTTON_GAP,
      flexWrap: 'wrap' as const,
      marginBottom: SPACING.CARD_GAP,
      [MOBILE_QUERY]: {
        alignItems: 'stretch',
        flexDirection: 'column' as const,
      },
    },
    mobilePageTitle: createMobilePageTitleStyle(themeColors.fontColor),
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_BUTTON_GAP,
      flexWrap: 'wrap' as const,
      marginLeft: 'auto',
      [MOBILE_QUERY]: {
        marginLeft: 0,
      },
    },
    headerButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
      flexWrap: 'wrap' as const,
    },
    mobileHeaderRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
    },
    sheetButtonIcon: {
      fontSize: ICON_SIZE.SM,
      marginRight: SPACING.CARD_CONTENT_GAP,
    },
    mobileTrigger: {
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'flexShrink': 0,
      'width': ICON_SIZE.LG,
      'height': ICON_SIZE.LG,
      'padding': 0,
      'border': 'none',
      'background': 'transparent',
      'cursor': 'pointer',
      'color': themeColors.fontColor,
      'marginLeft': 'auto',
      '& svg': {
        fontSize: ICON_SIZE.LG,
      },
    },
    sheetContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: SPACING.CARD_BUTTON_GAP,
      padding: `${FILTER_SHEET.TITLE_TO_GROUP}px ${FILTER_SHEET.PADDING_X}px ${FILTER_SHEET.BODY_PADDING_BOTTOM}px`,
    },
    sheetPills: {
      'display': 'flex',
      'gap': SPACING.CARD_BUTTON_GAP,
      '& > button': {
        flex: '1 1 0',
        minWidth: 0,
      },
    },
    sheetPill: {
      fontFamily,
      fontSize: fontSizes.pill,
      fontWeight: fontWeights.medium,
      lineHeight: FILTER_SHEET.PILL_LINE_HEIGHT,
      letterSpacing: '0.15px',
      color: themeColors.fontColor,
      backgroundColor: 'transparent',
      border: `${FILTER_SHEET.PILL_BORDER_WIDTH}px solid ${themeColors.borderColor}`,
      borderRadius: FILTER_SHEET.PILL_RADIUS,
      padding: `${FILTER_SHEET.PILL_PADDING_Y}px ${FILTER_SHEET.PILL_PADDING_X}px`,
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
      textAlign: 'center' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    sheetPillSelected: {
      color: themeColors.badges.filledBadgeBg,
      border: `${FILTER_SHEET.PILL_BORDER_WIDTH}px solid ${themeColors.badges.filledBadgeBg}`,
    },
    sheetButtonRow: {
      'display': 'flex',
      'gap': SPACING.CARD_BUTTON_GAP,
      '& > *': {
        flex: '1 1 0',
        minWidth: 0,
      },
    },
    anomalySummary: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
      flexWrap: 'wrap' as const,
      minWidth: 0,
    },
    anomalyCount: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.tight,
      color: themeColors.badges.statusInactive,
      [MOBILE_QUERY]: {
        fontSize: fontSizes.md,
        lineHeight: lineHeights.base,
      },
    },
    anomalyCountClear: {
      color: themeColors.fontColor,
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gap: SPACING.CARD_BUTTON_GAP,
      width: '100%',
      marginBottom: SPACING.CARD_BUTTON_GAP,
      [WIDE_MAX_QUERY]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      [MOBILE_QUERY]: {
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: SPACING.CARD_BUTTON_GAP,
      },
    },
    kpiCard: {
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      minHeight: SUMMARY_CARD.MIN_HEIGHT,
      width: '100%',
      padding: `${SUMMARY_CARD.PADDING_VERTICAL}px ${SUMMARY_CARD.PADDING_HORIZONTAL}px`,
      boxSizing: 'border-box' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      gap: SUMMARY_CARD.CONTENT_GAP,
      [WIDE_MAX_QUERY]: {
        padding: `${SUMMARY_CARD.PADDING_VERTICAL}px ${SPACING.CARD_PADDING}px`,
      },
      [TABLET_MAX_QUERY]: {
        minHeight: 0,
        padding: `${SPACING.CONTENT_PADDING}px ${SPACING.CARD_PADDING}px`,
        gap: SPACING.CARD_CONTENT_GAP,
      },
    },
    kpiLabel: {
      fontFamily: fontFamily,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      margin: 0,
      [TABLET_MAX_QUERY]: {
        fontSize: fontSizes.md,
      },
    },
    kpiValue: {
      fontFamily: fontFamily,
      fontSize: fontSizes['4xl'],
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.normal,
      margin: 0,
      [TABLET_MAX_QUERY]: {
        fontSize: fontSizes['2xl'],
      },
    },
    kpiValueUnit: {
      fontSize: fontSizes['2xl'],
      fontWeight: fontWeights.medium,
      marginLeft: KPI_VALUE_UNIT_GAP,
      [TABLET_MAX_QUERY]: {
        fontSize: fontSizes.md,
      },
    },
    // Mirrors the chart tooltip (Dashboards/Chart/TooltipDesign) so both read as one control.
    infoTooltip: {
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.normal,
      borderRadius: BORDER_RADIUS.SMALL_MEDIUM,
      padding: '12px 16px',
      maxWidth: 320,
      border: `1px solid rgba(${hexToRgb(isDark ? customColors.white : customColors.black)}, ${
        isDark ? 0.2 : 0.1
      })`,
      boxShadow: `0px 4px 16px 0px rgba(${hexToRgb(customColors.black)}, 0.25)`,
    },
    infoTooltipAnchor: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      minWidth: 0,
      maxWidth: '100%',
    },
    kpiCaption: {
      fontFamily,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      opacity: OPACITY.PLACEHOLDER,
      margin: 0,
    },
    kpiDeltaRow: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
      flexWrap: 'wrap' as const,
      margin: 0,
    },
    kpiDeltaBadge: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'gap': KPI_DELTA_BADGE.ICON_GAP,
      'padding': `${KPI_DELTA_BADGE.PADDING_Y}px ${KPI_DELTA_BADGE.PADDING_X}px`,
      'borderRadius': BORDER_RADIUS.LARGE,
      'fontFamily': fontFamily,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.semiBold,
      'lineHeight': lineHeights.tight,
      '& svg': {
        fontSize: ICON_SIZE.SM,
      },
    },
    kpiDeltaNeutral: {
      color: themeColors.fontColor,
      backgroundColor: `rgba(${hexToRgb(themeColors.fontColor)}, ${OPACITY.HOVER_LIGHT})`,
      opacity: OPACITY.PLACEHOLDER,
    },
    kpiDeltaGood: {
      color: themeColors.badges.statusActive,
      backgroundColor: `rgba(${hexToRgb(themeColors.badges.statusActive)}, ${OPACITY.HOVER_DARK})`,
    },
    kpiDeltaBad: {
      color: themeColors.badges.statusInactive,
      backgroundColor: `rgba(${hexToRgb(themeColors.badges.statusInactive)}, ${OPACITY.HOVER_DARK})`,
    },
    kpiChips: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: SUMMARY_CARD.CONTENT_GAP,
    },
    toggleGroup: {
      'display': 'flex',
      'gap': 0,
      '& > button': {
        minWidth: SEGMENTED_CONTROL.BUTTON_MIN_WIDTH,
      },
      [MOBILE_QUERY]: {
        'width': '100%',
        '& > button': {
          flex: 1,
          minWidth: 0,
        },
      },
    },
    fullWidthRow: {
      'width': '100%',
      'marginBottom': SPACING.CARD_GAP,
      '&:last-child': {
        marginBottom: 0,
      },
    },
    tableWrapper: {
      width: '100%',
      flexShrink: 0,
      overflowX: 'auto' as const,
      overflowY: 'hidden' as const,
      scrollbarGutter: 'stable' as const,
      paddingBottom: CHART_SCROLLBAR_GUTTER,
      marginBottom: CHART_SCROLLBAR_GUTTER,
    },
    velocityTable: {
      width: '100%',
      borderCollapse: 'separate' as const,
      borderSpacing: 4,
      fontFamily,
      fontSize: fontSizes.base,
      color: themeColors.fontColor,
      [MOBILE_QUERY]: {
        fontSize: fontSizes.sm,
      },
    },
    velocityRowIdentity: {
      textAlign: 'left' as const,
      fontWeight: fontWeights.medium,
      padding: '4px 8px',
      maxWidth: CHART_EMPTY_INSET.VELOCITY_LABEL_WIDTH,
      overflow: 'hidden' as const,
      textOverflow: 'ellipsis' as const,
      whiteSpace: 'nowrap' as const,
      color: themeColors.fontColor,
      [MOBILE_QUERY]: {
        maxWidth: MOBILE_VELOCITY_LABEL_WIDTH,
        padding: '4px 6px',
      },
    },
    velocityHeadIdentity: {
      textAlign: 'left' as const,
      fontWeight: fontWeights.medium,
      padding: '4px 8px',
      whiteSpace: 'nowrap' as const,
      opacity: OPACITY.PLACEHOLDER,
    },
    velocityHeadCell: {
      textAlign: 'center' as const,
      fontWeight: fontWeights.medium,
      padding: '4px 8px',
      whiteSpace: 'nowrap' as const,
      opacity: OPACITY.PLACEHOLDER,
      [MOBILE_QUERY]: {
        padding: '4px 4px',
      },
    },
    velocityCell: {
      textAlign: 'center' as const,
      padding: '10px 8px',
      borderRadius: BORDER_RADIUS.SMALL,
      color: themeColors.chart.cellText,
      minWidth: 64,
      [MOBILE_QUERY]: {
        minWidth: MOBILE_VELOCITY_CELL_MIN_WIDTH,
        padding: '8px 4px',
      },
    },
    chartCardBody: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
    },
    chartFullscreenFrame: {
      ...getScrollbarStyles(themeColors),
      '&::-webkit-scrollbar': {
        width: CHART_SCROLLBAR_GUTTER,
        height: CHART_SCROLLBAR_GUTTER,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: themeColors.borderColor,
        borderRadius: CHART_SCROLLBAR_GUTTER,
        border: `${SCROLLBAR_THUMB_INSET}px solid transparent`,
        backgroundClip: 'content-box' as const,
      },
      'width': '100%',
      'paddingBottom': CHART_SCROLLBAR_GUTTER,
      'marginBottom': CHART_SCROLLBAR_GUTTER,
      'height': CHART_HEIGHT.FULLSCREEN,
      'minHeight': CHART_HEIGHT.FULLSCREEN,
      'maxHeight': CHART_HEIGHT.FULLSCREEN,
      'overflow': 'auto' as const,
      'overscrollBehavior': 'contain' as const,
      'scrollbarGutter': 'stable' as const,
      'display': 'flex',
      'flexDirection': 'column' as const,
      'justifyContent': 'safe center',
      'flexShrink': 0,
      [TABLET_MAX_QUERY]: {
        height: FULLSCREEN_FRAME_COMPACT_HEIGHT,
        minHeight: FULLSCREEN_FRAME_COMPACT_HEIGHT,
        maxHeight: FULLSCREEN_FRAME_COMPACT_HEIGHT,
      },
    },
    chartCanvas: {
      width: '100%',
      height: CHART_HEIGHT.DESKTOP,
      [TABLET_MAX_QUERY]: {
        height: CHART_HEIGHT.COMPACT,
      },
      [MOBILE_QUERY]: {
        height: CHART_HEIGHT.MOBILE,
      },
    },
    chartBody: {
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      flex: '0 0 auto',
      minWidth: 0,
    },
    emptyState: {
      position: 'absolute' as const,
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none' as const,
      zIndex: 1,
      fontFamily,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.medium,
      color: themeColors.fontColor,
      borderRadius: BORDER_RADIUS.SMALL_MEDIUM,
      [MOBILE_QUERY]: {
        fontSize: fontSizes.md,
      },
    },
  }
})

export { useSecurityStyles }
