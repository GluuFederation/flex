import { makeStyles } from 'tss-react/mui'
import customColors, { getLoadingOverlayRgba, hexToRgb } from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  FILTER_SHEET,
  ICON_SIZE,
  MOBILE_MEDIA_QUERY,
  MOBILE_PAGE_PADDING_X,
  OPACITY,
  SPACING,
  STACKED_CHART_MAX_MEDIA_QUERY,
  TABLET_MAX_MEDIA_QUERY,
} from '@/constants'
import { SHEET } from '@/components/MobileBottomNav/sheetConstants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { METRICS_CHART_COLORS, METRICS_CHART_HEIGHT } from './constants'

const Y_TICK_LINE_HEIGHT = 1
const Y_AXIS_COLUMN_WIDTH = 28
const Y_AXIS_TICK_GAP = 10

const MOBILE_QUERY = `@media ${MOBILE_MEDIA_QUERY}`
const STACKED_CHART_QUERY = `@media ${STACKED_CHART_MAX_MEDIA_QUERY}`
const TABLET_QUERY = `@media ${TABLET_MAX_MEDIA_QUERY}`
const ACTION_PREFERRED_WIDTH = 120
const ACTION_MIN_WIDTH = 88
const ACTION_SCALE_START_VW = 1024
const ACTION_SCALE_END_VW = 768
const ACTION_SCALE_SLOPE =
  (ACTION_PREFERRED_WIDTH - ACTION_MIN_WIDTH) / (ACTION_SCALE_START_VW - ACTION_SCALE_END_VW)
const ACTION_SCALE_INTERCEPT = ACTION_MIN_WIDTH - ACTION_SCALE_SLOPE * ACTION_SCALE_END_VW
const ACTION_FLUID_WIDTH = `clamp(${ACTION_MIN_WIDTH}px, calc(${ACTION_SCALE_SLOPE * 100}vw + ${ACTION_SCALE_INTERCEPT}px), ${ACTION_PREFERRED_WIDTH}px)`
const DATE_MIN_WIDTH = 180
const DATE_WIDE_MIN_WIDTH = 240
const DATE_DESKTOP_MIN_WIDTH = 220
const DATE_WIDE_DESKTOP_MIN_WIDTH = 280
const MOBILE_CARD_PADDING = 18
const MOBILE_CARD_PADDING_BOTTOM = 10
const MOBILE_CARD_GAP = 16
const MOBILE_DONUT_SIZE = 90
const MOBILE_DONUT_HOLE = Math.round(MOBILE_DONUT_SIZE * 0.62)
const COMPACT_LEGEND_FONT_SIZE = 'clamp(9px, 2.6vw, 12px)'
const COMPACT_LEGEND_GAP = 'clamp(24px, 7vw, 44px)'
const FLUID_DONUT_SIZE = 'clamp(88px, 22vw, 150px)'
const FLUID_DONUT_RIGHT = 'clamp(4px, 6vw, 70px)'
const TAB_LABEL_INSET = 16
const HEATMAP_AXIS_LABEL_FONT_SIZE = 'clamp(10px, 1.6vw, 14px)'
const CHART_SCROLLBAR_GUTTER = 10

const HEATMAP_MODAL_OVERLAY_LIGHT = getLoadingOverlayRgba(customColors.black, 0.55)
const HEATMAP_MODAL_OVERLAY_DARK = getLoadingOverlayRgba(customColors.black, 0.7)
const HEATMAP_MODAL_SHADOW_DARK = `0 24px 64px rgba(${hexToRgb(customColors.black)}, 0.6), 0 12px 32px rgba(${hexToRgb(customColors.black)}, 0.4)`
const HEATMAP_MODAL_SHADOW_LIGHT = `0 24px 64px rgba(${hexToRgb(customColors.black)}, 0.25), 0 12px 32px rgba(${hexToRgb(customColors.black)}, 0.15)`

type MetricsStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useMetricsStyles = makeStyles<MetricsStylesParams>()((_, { isDark, themeColors }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  return {
    page: {
      fontFamily,
    },
    filterCard: {
      width: '100%',
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: `${SPACING.CARD_PADDING}px 20px`,
      marginBottom: `${SPACING.CARD_GAP}px`,
      [MOBILE_QUERY]: {
        padding: MOBILE_CARD_PADDING,
        marginBottom: MOBILE_CARD_GAP,
      },
      position: 'relative' as const,
      zIndex: 0,
      overflow: 'visible',
      boxSizing: 'border-box' as const,
    },
    mobileFilterTrigger: {
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
      'marginRight': TAB_LABEL_INSET,
      '& svg': {
        fontSize: ICON_SIZE.LG,
      },
    },
    filterSheetButtonRow: {
      'display': 'flex',
      'gap': FILTER_SHEET.BUTTONS_GAP,
      'marginTop': FILTER_SHEET.BUTTONS_MT - FILTER_SHEET.GROUP_GAP,
      '& > *': {
        flex: '1 1 0',
        minWidth: 0,
      },
    },
    filterSheetContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: FILTER_SHEET.GROUP_GAP,
      padding: `${FILTER_SHEET.TITLE_TO_GROUP}px ${FILTER_SHEET.PADDING_X}px ${FILTER_SHEET.BODY_PADDING_BOTTOM}px`,
    },
    filterCardContent: {
      position: 'relative' as const,
      zIndex: 2,
      isolation: 'isolate',
      pointerEvents: 'auto' as const,
    },
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
    chartCaption: {
      textAlign: 'center' as const,
      fontSize: fontSizes.pill,
      marginBottom: 16,
      color: themeColors.fontColor,
      [MOBILE_QUERY]: {
        fontSize: fontSizes.xs,
        marginBottom: 12,
      },
    },
    chartModalCaption: {
      textAlign: 'center' as const,
      fontSize: fontSizes.description,
      marginBottom: 16,
      color: themeColors.fontColor,
    },
    chartFullscreenFrame: {
      width: '100%',
      height: METRICS_CHART_HEIGHT.FULLSCREEN,
      minHeight: METRICS_CHART_HEIGHT.FULLSCREEN,
      maxHeight: METRICS_CHART_HEIGHT.FULLSCREEN,
      overflow: 'auto' as const,
      overscrollBehavior: 'contain' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'safe center',
      flexShrink: 0,
    },
    chartScrollArea: {
      width: '100%',
      flexShrink: 0,
      overflowX: 'auto' as const,
      overflowY: 'hidden' as const,
      paddingBottom: CHART_SCROLLBAR_GUTTER,
      marginBottom: CHART_SCROLLBAR_GUTTER,
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
      backgroundColor: isDark ? HEATMAP_MODAL_OVERLAY_DARK : HEATMAP_MODAL_OVERLAY_LIGHT,
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
      boxShadow: isDark ? HEATMAP_MODAL_SHADOW_DARK : HEATMAP_MODAL_SHADOW_LIGHT,
      width: 'min(1400px, 95vw)',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '92vh',
      zIndex: 1050,
      padding: 0,
      boxSizing: 'border-box' as const,
      display: 'flex',
      [TABLET_QUERY]: {
        width: `calc(100vw - ${MOBILE_PAGE_PADDING_X.MD * 2}px)`,
        maxWidth: `calc(100vw - ${MOBILE_PAGE_PADDING_X.MD * 2}px)`,
        height: 'auto',
        maxHeight: '80vh',
        zIndex: SHEET.Z_BAR_ELEVATED + 2,
      },
      flexDirection: 'column' as const,
    },
    chartModalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      [TABLET_QUERY]: {
        padding: `12px ${MOBILE_CARD_PADDING}px`,
      },
      borderBottom: `1px solid ${themeColors.borderColor}`,
      flexShrink: 0,
    },
    chartModalTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      [TABLET_QUERY]: {
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
      [TABLET_QUERY]: {
        flex: '0 1 auto',
        padding: MOBILE_CARD_PADDING,
      },
    },
    generalChartCol: {
      'flex': '0 0 100%',
      'maxWidth': '100%',
      'marginBottom': 16,
      '@media (min-width: 1500px)': {
        flex: '0 0 50%',
        maxWidth: '50%',
        marginBottom: 0,
      },
    },
    heatmapAxisStack: {
      display: 'flex',
      flexDirection: 'column' as const,
      minWidth: 0,
    },
    heatmapXAxisLabel: {
      fontFamily,
      fontSize: HEATMAP_AXIS_LABEL_FONT_SIZE,
      color: themeColors.fontColor,
      textAlign: 'center' as const,
      marginTop: 6,
    },
    chartLegendWrapper: {
      position: 'relative' as const,
      width: '100%',
      minWidth: 0,
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
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      whiteSpace: 'nowrap' as const,
    },
    chartRow: {
      [MOBILE_QUERY]: {
        '&&': {
          marginBottom: MOBILE_CARD_GAP,
        },
        '&& > [class*="col"]': {
          marginBottom: 0,
        },
        '&& > [class*="col"]:not(:last-child)': {
          marginBottom: MOBILE_CARD_GAP,
        },
      },
    },
    chartTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      marginTop: 0,
      marginBottom: 16,
      [MOBILE_QUERY]: {
        fontSize: fontSizes.description,
        fontWeight: fontWeights.semiBold,
        marginBottom: 12,
      },
    },
    adoptionStatsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      marginBottom: 12,
      [MOBILE_QUERY]: {
        flexWrap: 'wrap' as const,
        gap: 12,
        marginBottom: 8,
      },
    },
    adoptionStatLabel: {
      fontFamily,
      fontSize: fontSizes.sm,
      color: themeColors.fontColor,
      margin: 0,
    },
    adoptionStatValue: {
      fontFamily,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes.lg,
      color: themeColors.fontColor,
    },
    adoptionRateLabel: {
      fontFamily,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes.xl,
      color: METRICS_CHART_COLORS.adoptionRate,
      textAlign: 'center' as const,
    },
    adoptionChartWrapper: {
      flex: 1,
      minHeight: 340,
      [STACKED_CHART_QUERY]: {
        minHeight: METRICS_CHART_HEIGHT.DESKTOP,
        height: METRICS_CHART_HEIGHT.DESKTOP,
      },
      [TABLET_QUERY]: {
        minHeight: METRICS_CHART_HEIGHT.COMPACT,
        height: METRICS_CHART_HEIGHT.COMPACT,
      },
      display: 'flex',
      flexDirection: 'column' as const,
    },
    adoptionChartRow: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row' as const,
      minHeight: 0,
    },
    adoptionYAxisColumn: {
      width: Y_AXIS_COLUMN_WIDTH,
      flexShrink: 0,
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    adoptionYAxisTicks: {
      'position': 'absolute' as const,
      'left': 0,
      'right': Y_AXIS_TICK_GAP,
      'pointerEvents': 'none' as const,
      '& > span': {
        position: 'absolute' as const,
        left: 0,
        transform: 'translateY(-50%)',
      },
    },
    adoptionDottedBox: {
      flex: 1,
      position: 'relative' as const,
      border: `1px dashed ${themeColors.borderColor}`,
      borderRadius: 8,
      overflow: 'visible' as const,
    },
    chartLabelSm: {
      fill: themeColors.fontColor,
      fontSize: fontSizes.xs,
    },
    chartLabelMd: {
      fill: themeColors.fontColor,
      fontSize: fontSizes.sm,
      [MOBILE_QUERY]: {
        fontSize: fontSizes.xs,
      },
    },
    chartColorBarSvg: {
      flexShrink: 0,
    },
    chartColorBarBox: {
      height: '100%',
    },
    authChartHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: SPACING.CARD_PADDING,
      marginBottom: 4,
      [MOBILE_QUERY]: {
        gap: 12,
      },
    },
    authChartCanvas: {
      flex: 1,
      minHeight: 320,
      [STACKED_CHART_QUERY]: {
        flex: 'none',
        minHeight: 0,
      },
    },
    onboardingCanvas: {
      position: 'relative' as const,
      width: '100%',
      height: 320,
      [TABLET_QUERY]: {
        height: METRICS_CHART_HEIGHT.COMPACT,
      },
    },
    onboardingChartArea: {
      position: 'relative' as const,
      width: '100%',
      [MOBILE_QUERY]: {
        display: 'flex',
        flexDirection: 'column' as const,
      },
    },
    onboardingLegend: {
      position: 'absolute' as const,
      top: 12,
      left: 80,
      [MOBILE_QUERY]: {
        position: 'static' as const,
        alignSelf: 'center',
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        justifyContent: 'center',
        padding: 0,
        border: 'none',
        backgroundColor: 'transparent',
        gap: 12,
        marginBottom: 8,
      },
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
      padding: '10px 14px',
      border: `1px solid ${themeColors.borderColor}`,
      borderRadius: 6,
      backgroundColor: cardBg,
    },
    onboardingLegendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    onboardingLegendDash: {
      width: 14,
      height: 4,
      borderRadius: 2,
      display: 'inline-block',
    },
    onboardingLegendLabel: {
      fontFamily,
      fontSize: fontSizes.pill,
      fontWeight: fontWeights.semiBold,
    },
    filterRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: SPACING.CARD_BUTTON_GAP,
      flexWrap: 'wrap' as const,
      [MOBILE_QUERY]: {
        flexDirection: 'column' as const,
        alignItems: 'stretch',
        gap: MOBILE_CARD_GAP,
      },
    },
    filterDateField: {
      flex: 1,
      minWidth: DATE_DESKTOP_MIN_WIDTH,
      [TABLET_QUERY]: {
        minWidth: DATE_MIN_WIDTH,
      },
      [MOBILE_QUERY]: {
        width: '100%',
        minWidth: 0,
      },
    },
    filterDateFieldWide: {
      flex: 2,
      minWidth: DATE_WIDE_DESKTOP_MIN_WIDTH,
      [TABLET_QUERY]: {
        minWidth: DATE_WIDE_MIN_WIDTH,
      },
      [MOBILE_QUERY]: {
        width: '100%',
        minWidth: 0,
      },
    },
    filterActionField: {
      flex: '0 0 auto',
      width: ACTION_FLUID_WIDTH,
      [MOBILE_QUERY]: {
        width: '100%',
      },
    },
    filterActionFieldEnd: {
      alignSelf: 'flex-end',
      flex: '0 0 auto',
      width: ACTION_FLUID_WIDTH,
      [MOBILE_QUERY]: {
        alignSelf: 'stretch',
        width: '100%',
      },
    },
    aggTypeField: {
      flex: 1,
      minWidth: 180,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
      [MOBILE_QUERY]: {
        width: '100%',
        minWidth: 0,
      },
    },
    aggFieldLabel: {
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.semiBold,
      color: themeColors.fontColor,
    },
    aggSelectWrapper: {
      position: 'relative' as const,
      width: '100%',
    },
    aggSelect: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: 52,
      padding: '0 36px 0 16px',
      border: `1px solid ${isDark ? 'transparent' : themeColors.borderColor}`,
      borderRadius: BORDER_RADIUS.SMALL,
      backgroundColor: themeColors.inputBackground,
      color: themeColors.fontColor,
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      outline: 'none',
      appearance: 'none' as const,
      WebkitAppearance: 'none' as const,
      cursor: 'pointer',
      boxSizing: 'border-box' as const,
    },
    aggSelectPlaceholder: {
      opacity: OPACITY.PLACEHOLDER,
    },
    aggSelectChevron: {
      position: 'absolute' as const,
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none' as const,
      display: 'flex',
      color: themeColors.fontColor,
    },
    adoptionYAxisTick: {
      fontFamily,
      fontSize: fontSizes.xs,
      lineHeight: Y_TICK_LINE_HEIGHT,
      color: themeColors.fontColor,
    },
    adoptionChartCanvas: {
      position: 'relative' as const,
      width: '100%',
      height: '100%',
    },
    adoptionArrowOverlay: {
      position: 'absolute' as const,
      inset: 0,
      pointerEvents: 'none' as const,
      overflow: 'visible' as const,
    },
    adoptionDonutLabel: {
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.tight,
      color: METRICS_CHART_COLORS.adoptionRate,
      [MOBILE_QUERY]: {
        fontSize: fontSizes.xs,
      },
    },
    adoptionDonutValue: {
      fontFamily,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      color: METRICS_CHART_COLORS.adoptionRate,
      [MOBILE_QUERY]: {
        fontSize: fontSizes.base,
      },
    },
    adoptionLegendLabel: {
      fontFamily,
      fontSize: fontSizes.sm,
      color: themeColors.fontColor,
    },
    chartCardBody: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
    },
    adoptionLegend: {
      display: 'flex',
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 24,
      paddingTop: 16,
      [MOBILE_QUERY]: {
        gap: 12,
        paddingTop: 8,
        paddingBottom: 0,
      },
    },
    adoptionLegendItem: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: 8,
    },
    adoptionLegendDot: {
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: '50%',
      flexShrink: 0,
    },
    adoptionFullscreenArea: {
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 0,
    },
    adoptionDonutOverlay: {
      'position': 'absolute' as const,
      'top': '50%',
      'right': 70,
      'transform': 'translateY(-50%)',
      'zIndex': 2,
      'width': 170,
      'display': 'flex',
      'flexDirection': 'column' as const,
      'alignItems': 'center',
      'flexShrink': 0,
      '@media (min-width: 1000px)': {
        right: 55,
        width: 200,
      },
      '@media (min-width: 1500px)': {
        right: 40,
        width: 230,
      },
      [MOBILE_QUERY]: {
        right: FLUID_DONUT_RIGHT,
        width: FLUID_DONUT_SIZE,
      },
    },
    adoptionDonutWrapper: {
      'width': 170,
      'height': 170,
      'minWidth': 170,
      'minHeight': 170,
      'flexShrink': 0,
      'position': 'relative' as const,
      '@media (min-width: 1000px)': {
        width: 200,
        height: 200,
        minWidth: 200,
        minHeight: 200,
      },
      '@media (min-width: 1500px)': {
        width: 230,
        height: 230,
        minWidth: 230,
        minHeight: 230,
      },
      [MOBILE_QUERY]: {
        width: FLUID_DONUT_SIZE,
        height: FLUID_DONUT_SIZE,
        minWidth: FLUID_DONUT_SIZE,
        minHeight: FLUID_DONUT_SIZE,
      },
    },
    adoptionDonutCaption: {
      fontFamily,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.tight,
      color: METRICS_CHART_COLORS.adoptionRate,
      textAlign: 'center' as const,
      marginTop: 6,
    },
    adoptionDonutCenter: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center' as const,
      pointerEvents: 'none' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      [MOBILE_QUERY]: {
        width: MOBILE_DONUT_HOLE,
      },
    },
  }
})
