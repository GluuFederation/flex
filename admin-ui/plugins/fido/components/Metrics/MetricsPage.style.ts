import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  FILTER_SHEET,
  ICON_SIZE,
  MOBILE_QUERY,
  OPACITY,
  SPACING,
  STACKED_CHART_QUERY,
  TABLET_MAX_QUERY,
} from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { METRICS_CHART_COLORS } from './constants'
import {
  CHART_HEIGHT,
  CHART_SCROLLBAR_GUTTER,
  getCompactFullscreenFrameHeight,
} from 'Plugins/fido/shared/charts'

const Y_TICK_LINE_HEIGHT = 1
const Y_AXIS_COLUMN_WIDTH = 28
const Y_AXIS_TICK_GAP = 10

const ACTION_PREFERRED_WIDTH = 120
const DATE_MIN_WIDTH = 180
const DATE_WIDE_MIN_WIDTH = 240
const DATE_DESKTOP_MIN_WIDTH = 220
const DATE_WIDE_DESKTOP_MIN_WIDTH = 280
const MOBILE_CARD_PADDING = 18
const MOBILE_CARD_GAP = 16
const MOBILE_DONUT_SIZE = 90
const MOBILE_DONUT_HOLE = Math.round(MOBILE_DONUT_SIZE * 0.62)
const FLUID_DONUT_SIZE = 'clamp(88px, 22vw, 150px)'
const FLUID_DONUT_RIGHT = 'clamp(4px, 6vw, 70px)'
const TAB_LABEL_INSET = 16
const HEATMAP_AXIS_LABEL_FONT_SIZE = 'clamp(10px, 1.6vw, 14px)'
const HEATMAP_AXIS_LABEL_GAP = 6
const FULLSCREEN_FRAME_COMPACT_HEIGHT = getCompactFullscreenFrameHeight(CHART_HEIGHT.MOBILE)

export const getScrollCanvasStyle = (isFullscreen: boolean, zoom: number, scrollWidth?: number) => {
  if (isFullscreen) {
    return {
      width: scrollWidth ? scrollWidth * zoom : `${zoom * 100}%`,
      minWidth: `${zoom * 100}%`,
      flexShrink: 0,
    }
  }
  return scrollWidth ? { width: scrollWidth, minWidth: '100%' } : undefined
}

export const getAuthCanvasStyle = (
  canvasHeight: number | undefined,
  isFullscreen: boolean,
  zoom: number,
) =>
  canvasHeight
    ? {
        height: canvasHeight,
        width: isFullscreen ? `${zoom * 100}%` : undefined,
        flexShrink: isFullscreen ? 0 : undefined,
      }
    : undefined

export const getHeatmapAxisRowStyle = (verticalRowLabels: boolean, fullscreen: boolean) => ({
  display: 'flex',
  alignItems: 'flex-start' as const,
  gap: verticalRowLabels ? 12 : 4,
  ...(fullscreen ? { flexShrink: 0, width: 'max-content', minWidth: '100%' } : {}),
})

export const getHeatmapYAxisLabelStyle = (
  fontSize: number,
  color: string,
  useNaturalWidth: boolean,
) => ({
  display: 'flex',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  writingMode: 'vertical-lr' as const,
  transform: 'rotate(180deg)',
  fontSize,
  color,
  minWidth: useNaturalWidth ? 12 : 16,
  alignSelf: 'stretch' as const,
})

export const getHeatmapScrollStyle = (
  fullscreen: boolean,
  useVerticalScroll: boolean,
  scrollMaxHeight: number,
) =>
  fullscreen
    ? { flex: 'none', overflow: 'visible' as const }
    : {
        flex: 1,
        minWidth: 0,
        overflowX: 'auto' as const,
        scrollbarGutter: 'stable' as const,
        paddingBottom: CHART_SCROLLBAR_GUTTER,
        marginBottom: CHART_SCROLLBAR_GUTTER,
        ...(useVerticalScroll ? { maxHeight: scrollMaxHeight, overflowY: 'auto' as const } : {}),
      }

export const getHeatmapSvgStyle = (
  svgWidth: number,
  svgHeight: number,
  options: {
    fullscreen: boolean
    zoomLevel: number
    useNaturalWidth: boolean
    useVerticalScroll: boolean
    compact: boolean
  },
) => {
  const { fullscreen, zoomLevel, useNaturalWidth, useVerticalScroll, compact } = options

  if (fullscreen) {
    return {
      display: 'block' as const,
      width: svgWidth * zoomLevel,
      minWidth: svgWidth * zoomLevel,
      height: svgHeight * zoomLevel,
    }
  }
  if (useNaturalWidth) {
    return { display: 'block' as const, width: svgWidth, minWidth: svgWidth, height: svgHeight }
  }
  return {
    display: 'block' as const,
    width: '100%',
    ...(compact ? { maxWidth: svgWidth } : {}),
    ...(useVerticalScroll ? { height: svgHeight } : { height: 'auto' as const }),
  }
}

type MetricsStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useMetricsStyles = makeStyles<MetricsStylesParams>()((
  theme,
  { isDark, themeColors },
) => {
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
    chartFullscreenFrame: {
      width: '100%',
      height: CHART_HEIGHT.FULLSCREEN,
      minHeight: CHART_HEIGHT.FULLSCREEN,
      maxHeight: CHART_HEIGHT.FULLSCREEN,
      overflow: 'auto' as const,
      overscrollBehavior: 'contain' as const,
      scrollbarGutter: 'stable' as const,
      paddingBottom: CHART_SCROLLBAR_GUTTER,
      marginBottom: CHART_SCROLLBAR_GUTTER,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'safe center',
      flexShrink: 0,
      [TABLET_MAX_QUERY]: {
        height: FULLSCREEN_FRAME_COMPACT_HEIGHT,
        minHeight: FULLSCREEN_FRAME_COMPACT_HEIGHT,
        maxHeight: FULLSCREEN_FRAME_COMPACT_HEIGHT,
      },
    },
    chartScrollArea: {
      width: '100%',
      flexShrink: 0,
      overflowX: 'auto' as const,
      overflowY: 'hidden' as const,
      scrollbarGutter: 'stable' as const,
      paddingBottom: CHART_SCROLLBAR_GUTTER,
      marginBottom: CHART_SCROLLBAR_GUTTER,
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
    heatmapEmptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: CHART_HEIGHT.COMPACT,
      fontFamily,
      fontSize: fontSizes.description,
      color: themeColors.fontColor,
      opacity: OPACITY.PLACEHOLDER,
      textAlign: 'center' as const,
    },
    heatmapXAxisLabel: {
      fontFamily,
      fontSize: HEATMAP_AXIS_LABEL_FONT_SIZE,
      color: themeColors.fontColor,
      textAlign: 'center' as const,
      marginTop: HEATMAP_AXIS_LABEL_GAP,
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
        minHeight: CHART_HEIGHT.DESKTOP,
        height: CHART_HEIGHT.DESKTOP,
      },
      [TABLET_MAX_QUERY]: {
        minHeight: CHART_HEIGHT.COMPACT,
        height: CHART_HEIGHT.COMPACT,
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
      [TABLET_MAX_QUERY]: {
        height: CHART_HEIGHT.COMPACT,
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
      [TABLET_MAX_QUERY]: {
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
      [TABLET_MAX_QUERY]: {
        minWidth: DATE_WIDE_MIN_WIDTH,
      },
      [MOBILE_QUERY]: {
        width: '100%',
        minWidth: 0,
      },
    },
    filterActionField: {
      flex: '0 0 auto',
      width: ACTION_PREFERRED_WIDTH,
      [MOBILE_QUERY]: {
        width: '100%',
      },
    },
    filterActionFieldEnd: {
      alignSelf: 'flex-end',
      flex: '0 0 auto',
      width: ACTION_PREFERRED_WIDTH,
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
    adoptionDonutOverlayCentered: {
      '&&': {
        right: 'auto',
        left: '50%',
        transform: 'translate(-50%, -50%)',
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
