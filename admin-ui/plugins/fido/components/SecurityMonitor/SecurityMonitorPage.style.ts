import { makeStyles } from 'tss-react/mui'
import { hexToRgb } from '@/customColors'
import {
  BORDER_RADIUS,
  createMobilePageTitleStyle,
  FILTER_SHEET,
  ICON_SIZE,
  KPI_DELTA_BADGE,
  MOBILE_MEDIA_QUERY,
  OPACITY,
  SEGMENTED_CONTROL,
  SPACING,
  SUMMARY_CARD,
  TABLET_MAX_MEDIA_QUERY,
  WIDE_MAX_MEDIA_QUERY,
} from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { CHART_EMPTY_INSET, SECURITY_CHART_HEIGHT } from './constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { SecurityStylesParams } from './types'

const KPI_VALUE_UNIT_GAP = 2

const CHART_CARD_PADDING_X = 28

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
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
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
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
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
      alignItems: 'center',
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
    sheetActions: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: SPACING.CARD_BUTTON_GAP,
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
    },
    anomalyCountClear: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gap: SPACING.CARD_BUTTON_GAP,
      width: '100%',
      marginBottom: SPACING.CARD_GAP,
      [`@media ${WIDE_MAX_MEDIA_QUERY}`]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
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
      [`@media ${WIDE_MAX_MEDIA_QUERY}`]: {
        padding: `${SUMMARY_CARD.PADDING_VERTICAL}px ${SPACING.CARD_PADDING}px`,
      },
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
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
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        fontSize: fontSizes.md,
      },
    },
    kpiValue: {
      fontFamily: fontFamily,
      fontSize: fontSizes['4xl'],
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.normal,
      margin: 0,
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        fontSize: fontSizes['2xl'],
      },
    },
    kpiValueUnit: {
      fontSize: fontSizes['2xl'],
      fontWeight: fontWeights.medium,
      marginLeft: KPI_VALUE_UNIT_GAP,
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        fontSize: fontSizes.md,
      },
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
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        'width': '100%',
        '& > button': {
          flex: 1,
          minWidth: 0,
        },
      },
    },
    chartCard: {
      'width': '100%',
      'backgroundColor': cardBg,
      ...cardBorderStyle,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'padding': `${SPACING.CARD_PADDING}px ${CHART_CARD_PADDING_X}px`,
      'boxSizing': 'border-box' as const,
      'height': '100%',
      'position': 'relative' as const,
      '& svg:focus, & svg *:focus': {
        outline: 'none',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        padding: `${SPACING.CARD_BUTTON_GAP}px ${SPACING.CARD_BUTTON_GAP}px`,
      },
    },
    chartHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: SPACING.CARD_BUTTON_GAP,
      flexWrap: 'wrap' as const,
      marginBottom: SPACING.CARD_CONTENT_GAP,
    },
    chartHeaderRight: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
      flexWrap: 'wrap' as const,
    },
    chartTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      margin: 0,
      [`@media ${WIDE_MAX_MEDIA_QUERY}`]: {
        fontSize: fontSizes.content,
      },
    },
    chartSubtitle: {
      fontFamily,
      fontSize: fontSizes.base,
      color: themeColors.fontColor,
      opacity: OPACITY.PLACEHOLDER,
      marginTop: 4,
    },
    chartRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: SPACING.CARD_GAP,
      marginBottom: SPACING.CARD_GAP,
      [`@media ${WIDE_MAX_MEDIA_QUERY}`]: {
        gridTemplateColumns: 'minmax(0, 1fr)',
      },
    },
    fullWidthRow: {
      width: '100%',
      marginBottom: SPACING.CARD_GAP,
    },
    legendRow: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: SPACING.CARD_BUTTON_GAP,
      marginBottom: SPACING.CARD_CONTENT_GAP,
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
      fontFamily,
      fontSize: fontSizes.base,
      color: themeColors.fontColor,
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: BORDER_RADIUS.SMALL,
      display: 'inline-block',
      flexShrink: 0,
    },
    tableWrapper: {
      width: '100%',
      overflowX: 'auto' as const,
    },
    velocityTable: {
      width: '100%',
      borderCollapse: 'separate' as const,
      borderSpacing: 4,
      fontFamily,
      fontSize: fontSizes.base,
      color: themeColors.fontColor,
    },
    velocityCorner: {
      width: CHART_EMPTY_INSET.VELOCITY_LABEL_WIDTH,
      textAlign: 'left' as const,
      fontWeight: fontWeights.medium,
      padding: '4px 8px',
      whiteSpace: 'nowrap' as const,
    },
    velocityHeadCell: {
      textAlign: 'center' as const,
      fontWeight: fontWeights.medium,
      padding: '4px 8px',
      whiteSpace: 'nowrap' as const,
      opacity: OPACITY.PLACEHOLDER,
    },
    velocityRowLabel: {
      width: CHART_EMPTY_INSET.VELOCITY_LABEL_WIDTH,
      textAlign: 'left' as const,
      fontWeight: fontWeights.regular,
      padding: '4px 8px',
      whiteSpace: 'nowrap' as const,
    },
    velocityLabelCollapsed: {
      width: 0,
      padding: 0,
    },
    velocityCell: {
      textAlign: 'center' as const,
      padding: '10px 8px',
      borderRadius: BORDER_RADIUS.SMALL,
      color: themeColors.chart.cellText,
      minWidth: 64,
    },
    chartCardBody: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
    },
    chartCanvas: {
      width: '100%',
      height: SECURITY_CHART_HEIGHT,
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
    },
    emptyStateCompact: {
      fontSize: fontSizes.md,
    },
  }
})

export { useSecurityStyles }
