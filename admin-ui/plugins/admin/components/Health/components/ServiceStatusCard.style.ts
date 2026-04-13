import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { SPACING } from '@/constants'
import { fontFamily, fontWeights, fontSizes } from '@/styles/fonts'

const useStyles = makeStyles<{ isDark: boolean }>()((_, { isDark }) => ({
  card: {
    backgroundColor: isDark ? customColors.darkInputBg : customColors.white,
    borderRadius: 16,
    width: '100%',
    minHeight: 135,
    padding: 0,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    border: `1px solid ${isDark ? customColors.darkBorder : customColors.lightBorder}`,
  },
  content: {
    padding: `${SPACING.CARD_PADDING}px`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: `${SPACING.CARD_CONTENT_GAP}px`,
    minHeight: 0,
    boxSizing: 'border-box',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: `${SPACING.CARD_CONTENT_GAP}px`,
  },
  serviceName: {
    fontFamily,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.lg,
    lineHeight: '32px',
    color: isDark ? customColors.white : customColors.primaryDark,
    margin: 0,
    padding: 0,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  serviceMessage: {
    fontFamily,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.md,
    lineHeight: '32px',
    color: isDark ? customColors.white : customColors.primaryDark,
    margin: 0,
    padding: 0,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  statusBadge: {
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
}))

export { useStyles }
