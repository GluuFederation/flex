import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'
import { SPACING, MOBILE_MEDIA_QUERY } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'

const CARD_MIN_HEIGHT = 135
const CARD_RADIUS = 16
const CARD_TEXT_LINE_HEIGHT = '32px'
const MOBILE_CARD_MIN_HEIGHT = 79
const MOBILE_CARD_RADIUS = 8
const MOBILE_CARD_PADDING_Y = 16.5
const MOBILE_CARD_PADDING_X = 19.5
const BADGE_TOP_OFFSET = 2.39
const TEXT_BADGE_MIN_GAP = 8
const CARD_SHADOW_OPACITY = 0.05
const CARD_SHADOW = `0px 1.985px 2.73px 0px rgba(${hexToRgb(customColors.black)}, ${CARD_SHADOW_OPACITY})`

const useStyles = makeStyles<{ isDark: boolean }>()((_, { isDark }) => {
  const cardText = {
    fontFamily,
    lineHeight: CARD_TEXT_LINE_HEIGHT,
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
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      border: `1px solid ${isDark ? customColors.darkBorder : customColors.lightBorder}`,
      boxShadow: isDark ? 'none' : CARD_SHADOW,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        minHeight: MOBILE_CARD_MIN_HEIGHT,
        borderRadius: MOBILE_CARD_RADIUS,
      },
    },
    content: {
      padding: `${SPACING.CARD_PADDING}px`,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: `${TEXT_BADGE_MIN_GAP}px`,
      minHeight: 0,
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        padding: `${MOBILE_CARD_PADDING_Y}px ${MOBILE_CARD_PADDING_X}px`,
      },
    },
    textContainer: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: `${SPACING.CARD_CONTENT_GAP}px`,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        gap: 0,
      },
    },
    serviceName: {
      ...cardText,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes.lg,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: fontSizes.md,
        lineHeight: lineHeights.tight,
      },
    },
    serviceMessage: {
      ...cardText,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.md,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: '13px',
        lineHeight: lineHeights.tight,
      },
    },
    statusBadge: {
      flexShrink: 0,
      alignSelf: 'flex-start',
      marginTop: `${BADGE_TOP_OFFSET}px`,
    },
    badge: {
      borderWidth: '0 !important',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: '10px !important',
        lineHeight: '18.133px !important',
        letterSpacing: '0.1511px !important',
        padding: '6.044px !important',
        borderRadius: '3.778px !important',
      },
    },
  }
})

export { useStyles }
