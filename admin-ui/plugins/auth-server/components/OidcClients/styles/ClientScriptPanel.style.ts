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
  helperText: {
    marginTop: SPACING.CARD_CONTENT_GAP / 2,
    color: themeColors.textMuted,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.relaxed,
  },
  emptyState: {
    backgroundColor: themeColors.settings?.cardBackground ?? themeColors.card.background,
    border: `1px dashed ${themeColors.borderColor}`,
    borderRadius: BORDER_RADIUS.DEFAULT,
    padding: SPACING.CARD_PADDING,
    color: themeColors.textMuted,
    fontSize: fontSizes.base,
  },
}))
