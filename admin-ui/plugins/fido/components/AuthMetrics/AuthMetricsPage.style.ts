import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  MOBILE_MEDIA_QUERY,
  SPACING,
  SUMMARY_CARD,
  TABLET_MAX_MEDIA_QUERY,
  WIDE_MAX_MEDIA_QUERY,
} from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { SECURITY_CHART_HEIGHT } from '../SecurityMonitor/constants'

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

// Five cards rather than the Security Monitor's four, so the widest breakpoint carries an extra
// column; every step below reuses that page's breakpoints so the two dashboards reflow together.
const KPI_COLUMNS = 5

export const useAuthMetricsStyles = makeStyles<StylesParams>()((
  _theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  return {
    notice: {
      fontFamily,
      fontSize: fontSizes.base,
      color: themeColors.fontColor,
      marginBottom: SPACING.CARD_GAP,
    },
    // The MAU DateRangeSelector brings its own grid and now hosts the granularity menu, so this
    // only carries the gap down to the KPI strip.
    filterRow: {
      width: '100%',
      marginBottom: SPACING.CARD_GAP,
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${KPI_COLUMNS}, minmax(0, 1fr))`,
      gap: SPACING.CARD_BUTTON_GAP,
      width: '100%',
      marginBottom: SPACING.CARD_GAP,
      [`@media ${WIDE_MAX_MEDIA_QUERY}`]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        gridTemplateColumns: 'minmax(0, 1fr)',
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
    },
    kpiLabel: {
      fontFamily,
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
      fontFamily,
      fontSize: fontSizes['4xl'],
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.normal,
      color: themeColors.fontColor,
      margin: 0,
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        fontSize: fontSizes['2xl'],
      },
    },
    fullWidthRow: {
      width: '100%',
      marginBottom: SPACING.CARD_GAP,
    },
    // ResponsiveContainer measures its parent, so the canvas needs a height of its own. Shared
    // with the Security Monitor charts so the cards line up when both pages are open.
    chartCanvas: {
      width: '100%',
      height: SECURITY_CHART_HEIGHT,
    },
  }
})
