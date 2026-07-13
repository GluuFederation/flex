import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'
import { SPACING, MOBILE_MEDIA_QUERY, MOBILE_LAYOUT } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

interface StylesParams {
  themeColors: ThemeConfig
  isDark: boolean
}

export const useStyles = makeStyles<StylesParams>()((theme, { themeColors, isDark }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const dividerColor = themeColors.card.border

  return {
    mobileContentPad: {
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingLeft: MOBILE_LAYOUT.SCREEN_PAD,
        paddingRight: MOBILE_LAYOUT.SCREEN_PAD,
        boxSizing: 'border-box',
      },
    },
    mobilePageTitle: {
      display: 'none',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        display: 'block',
        fontFamily,
        fontSize: MOBILE_LAYOUT.PAGE_TITLE_SIZE,
        fontWeight: fontWeights.bold,
        lineHeight: 'normal',
        color: themeColors.fontColor,
        margin: 0,
        marginBottom: MOBILE_LAYOUT.PAGE_TITLE_GAP,
      },
    },
    licenseCard: {
      backgroundColor: cardBg,
      borderRadius: '16px',
      padding: `${SPACING.CONTENT_PADDING}px`,
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      ...cardBorderStyle,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingLeft: MOBILE_LAYOUT.CARD_PAD,
        paddingRight: MOBILE_LAYOUT.CARD_PAD,
        paddingTop: 0,
        paddingBottom: '32px',
      },
    },
    licenseContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: `${SPACING.CARD_GAP}px`,
      [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
      },
      // Figma stacks the fields, separating each with a full-width rule.
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        gridTemplateColumns: '1fr',
        gap: 0,
      },
    },
    fieldWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: `${SPACING.CARD_CONTENT_GAP}px`,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        // Figma repeats fields on an 86px pitch: two flush 28px line boxes with
        // ~15px of padding either side of the 1px rule. border-box keeps the
        // rule from adding to the pitch and compounding down the list.
        'gap': 0,
        'boxSizing': 'border-box',
        'paddingTop': '15px',
        'paddingBottom': '15px',
        'borderBottom': `1px solid ${dividerColor}`,
        '&:first-of-type': {
          paddingTop: '19px',
        },
        '&:last-of-type': {
          borderBottom: 'none',
        },
      },
    },
    label: {
      fontFamily,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.loose,
      color: themeColors.textMuted,
      margin: 0,
      padding: 0,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: fontSizes.base,
        lineHeight: lineHeights.relaxed,
      },
    },
    value: {
      fontFamily,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.loose,
      color: themeColors.fontColor,
      margin: 0,
      padding: 0,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: fontSizes.content,
        lineHeight: lineHeights.relaxed,
        wordBreak: 'break-word',
      },
    },
    buttonContainer: {
      marginTop: `${SPACING.CARD_GAP}px`,
      display: 'flex',
      justifyContent: 'flex-start',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        marginTop: '25px',
      },
    },
    resetButton: {
      gap: `${SPACING.CARD_CONTENT_GAP}px`,
      minWidth: 130,
      // Figma: full-width 40px green pill, 6px radius, 14px bold label.
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        width: '100% !important',
        minWidth: '0 !important',
        height: '40px !important',
        minHeight: '40px !important',
        borderRadius: '6px !important',
        backgroundColor: `${customColors.mobileNavActive} !important`,
        borderColor: `${customColors.mobileNavActive} !important`,
        justifyContent: 'center !important',
        fontSize: `${fontSizes.base} !important`,
        fontWeight: `${fontWeights.bold} !important`,
        letterSpacing: `${letterSpacing.button} !important`,
      },
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: '16px',
      border: `1px solid ${themeColors.card.border}`,
      boxShadow: 'none',
      padding: 0,
    },
    cardBody: {
      padding: '15px',
    },
  }
})
