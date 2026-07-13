import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'

const DARK_CARD_BORDER = '#284b6e'

const CARD_MIN_HEIGHT = 79
const CARD_RADIUS = 8
const CARD_PADDING_Y = 16.5
const CARD_PADDING_X = 19.5
const BADGE_TOP_OFFSET = 2.39
const TEXT_BADGE_MIN_GAP = 8
const CARD_SHADOW_OPACITY = 0.05
const CARD_SHADOW = `0px 1.985px 2.73px 0px rgba(${hexToRgb(customColors.black)}, ${CARD_SHADOW_OPACITY})`

const useStyles = makeStyles<{ isDark: boolean }>()((_, { isDark }) => {
  const cardText = {
    fontFamily,
    lineHeight: lineHeights.tight,
    color: isDark ? customColors.white : customColors.primaryDark,
    margin: 0,
    padding: 0,
    wordWrap: 'break-word' as const,
    overflowWrap: 'break-word' as const,
  }

  return {
    card: {
      backgroundColor: isDark ? customColors.darkInputBg : customColors.white,
      borderRadius: CARD_RADIUS,
      width: '100%',
      minHeight: CARD_MIN_HEIGHT,
      padding: 0,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxSizing: 'border-box',
      border: `1px solid ${isDark ? DARK_CARD_BORDER : customColors.lightBorder}`,
      boxShadow: isDark ? 'none' : CARD_SHADOW,
    },
    content: {
      padding: `${CARD_PADDING_Y}px ${CARD_PADDING_X}px`,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: `${TEXT_BADGE_MIN_GAP}px`,
      minHeight: 0,
      boxSizing: 'border-box',
    },
    textContainer: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },
    serviceName: {
      ...cardText,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes.md,
    },
    serviceMessage: {
      ...cardText,
      fontWeight: fontWeights.medium,
      fontSize: '13px',
    },
    statusBadge: {
      flexShrink: 0,
      alignSelf: 'flex-start',
      marginTop: `${BADGE_TOP_OFFSET}px`,
    },
    badge: {
      fontSize: '10px !important',
      lineHeight: '18.133px !important',
      letterSpacing: '0.1511px !important',
      padding: '6.044px !important',
      borderRadius: '3.778px !important',
      borderWidth: '0 !important',
    },
  }
})

export { useStyles }
