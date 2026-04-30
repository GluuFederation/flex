import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { METRICS_CHART_COLORS } from './constants'

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
      width: '100%',
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: '24px 28px',
      boxSizing: 'border-box' as const,
      height: '100%',
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
      flexDirection: 'row' as const,
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
    adoptionStatsLabels: {
      position: 'absolute' as const,
      top: 20,
      left: 20,
      zIndex: 2,
      lineHeight: 1.7,
      pointerEvents: 'none' as const,
    },
    adoptionNewUsersOverlay: {
      position: 'absolute' as const,
      top: 80,
      right: 110,
      zIndex: 2,
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: 8,
      pointerEvents: 'none' as const,
      whiteSpace: 'nowrap' as const,
    },
    adoptionDonutOverlay: {
      position: 'absolute' as const,
      bottom: 16,
      right: 80,
      zIndex: 2,
      width: 150,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    adoptionDonutWrapper: {
      width: 150,
      height: 150,
      position: 'relative' as const,
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
