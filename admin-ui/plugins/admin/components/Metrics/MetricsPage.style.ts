import { makeStyles } from 'tss-react/mui'
import customColors, { getLoadingOverlayRgba } from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, OPACITY, SPACING } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { METRICS_CHART_COLORS } from './constants'

const HEATMAP_MODAL_OVERLAY_LIGHT = getLoadingOverlayRgba(customColors.black, 0.55)
const HEATMAP_MODAL_OVERLAY_DARK = getLoadingOverlayRgba(customColors.black, 0.7)
const HEATMAP_MODAL_SHADOW_DARK = '0 24px 64px rgba(0, 0, 0, 0.6), 0 12px 32px rgba(0, 0, 0, 0.4)'
const HEATMAP_MODAL_SHADOW_LIGHT =
  '0 24px 64px rgba(0, 0, 0, 0.25), 0 12px 32px rgba(0, 0, 0, 0.15)'

interface MetricsStylesParams {
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
      position: 'relative' as const,
      zIndex: 0,
      overflow: 'visible',
      boxSizing: 'border-box' as const,
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
      'boxSizing': 'border-box' as const,
      'height': '100%',
      'position': 'relative' as const,
      '& svg:focus, & svg *:focus': {
        outline: 'none',
      },
    },
    heatmapExpandButton: {
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
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      },
    },
    heatmapModalOverlay: {
      position: 'fixed' as const,
      inset: 0,
      backgroundColor: isDark ? HEATMAP_MODAL_OVERLAY_DARK : HEATMAP_MODAL_OVERLAY_LIGHT,
      zIndex: 1040,
      cursor: 'pointer',
      border: 'none',
      padding: 0,
      margin: 0,
    },
    heatmapModalContainer: {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: cardBg,
      borderRadius: BORDER_RADIUS.DEFAULT,
      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.12)'}`,
      boxShadow: isDark ? HEATMAP_MODAL_SHADOW_DARK : HEATMAP_MODAL_SHADOW_LIGHT,
      width: 'min(1400px, 95vw)',
      maxWidth: '95vw',
      height: 'min(900px, 92vh)',
      maxHeight: '92vh',
      zIndex: 1050,
      padding: 0,
      boxSizing: 'border-box' as const,
      overflow: 'hidden' as const,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    heatmapModalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderBottom: `1px solid ${themeColors.borderColor}`,
      flexShrink: 0,
    },
    heatmapModalTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      margin: 0,
    },
    heatmapModalCloseButton: {
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
        opacity: 1 - OPACITY.DISABLED,
      },
    },
    heatmapModalBody: {
      flex: 1,
      minHeight: 0,
      padding: 24,
      overflow: 'auto' as const,
      display: 'flex',
      flexDirection: 'column' as const,
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
    chartTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      marginTop: 0,
      marginBottom: 16,
    },
    adoptionStatsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      marginBottom: 12,
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
      width: 20,
      flexShrink: 0,
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    adoptionYAxisTicks: {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      left: 0,
      right: 4,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      pointerEvents: 'none' as const,
    },
    adoptionDottedBox: {
      flex: 1,
      position: 'relative' as const,
      borderRadius: 8,
      overflow: 'visible' as const,
    },
    adoptionLegend: {
      display: 'flex',
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 24,
      paddingTop: 16,
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
    },
    adoptionDonutCenter: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center' as const,
      pointerEvents: 'none' as const,
    },
  }
})
