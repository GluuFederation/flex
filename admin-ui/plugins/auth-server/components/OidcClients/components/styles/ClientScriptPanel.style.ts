import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { fontSizes, lineHeights } from '@/styles/fonts'

type ClientScriptPanelStyleParams = {
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<ClientScriptPanelStyleParams>()((_, { themeColors }) => ({
  root: {
    'display': 'grid',
    'gridTemplateColumns': 'repeat(2, minmax(0, 1fr))',
    'gap': SPACING.SECTION_GAP,
    'alignItems': 'start',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  fieldWrap: {
    minWidth: 0,
  },
  emptyState: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.CARD_CONTENT_GAP,
    backgroundColor: themeColors.settings?.cardBackground ?? themeColors.card.background,
    border: `1px dashed ${themeColors.borderColor}`,
    borderRadius: BORDER_RADIUS.DEFAULT,
    padding: `${SPACING.CARD_PADDING * 2}px ${SPACING.CARD_PADDING}px`,
    textAlign: 'center' as const,
  },
  emptyStateIcon: {
    fontSize: '2rem',
    color: themeColors.textMuted,
    opacity: 0.5,
  },
  emptyStateTitle: {
    color: themeColors.fontColor,
    fontSize: fontSizes.base,
    fontWeight: 600,
    margin: 0,
  },
  emptyStateDescription: {
    color: themeColors.textMuted,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.relaxed,
    maxWidth: '480px',
    margin: 0,
  },
}))
