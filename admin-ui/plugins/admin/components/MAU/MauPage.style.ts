import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import {
  BORDER_RADIUS,
  SPACING,
  MOBILE_MEDIA_QUERY,
  MOBILE_PAGE_PADDING_X,
  TABLET_BAND_MEDIA_QUERY,
} from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

interface MauThemeColors {
  cardBg: string
  text: string
}

interface MauStylesParams {
  themeColors: MauThemeColors
  isDark: boolean
}

export const getLegendWrapperStyle = (color: string) => ({ color })

export const useMauStyles = makeStyles<MauStylesParams>()((
  theme: Theme,
  { themeColors, isDark },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })

  return {
    mobileContentPad: {
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingLeft: `${MOBILE_PAGE_PADDING_X.MD}px`,
        paddingRight: `${MOBILE_PAGE_PADDING_X.MD}px`,
        marginTop: `-${SPACING.PAGE / 2}px`,
        boxSizing: 'border-box',
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: `${MOBILE_PAGE_PADDING_X.SM}px`,
        paddingRight: `${MOBILE_PAGE_PADDING_X.SM}px`,
      },
    },
    mobilePageTitle: {
      display: 'none',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        display: 'block',
        fontFamily,
        fontSize: '28px',
        fontStyle: 'normal',
        fontWeight: fontWeights.bold,
        lineHeight: 'normal',
        color: themeColors.text,
        margin: 0,
        marginBottom: SPACING.PAGE,
      },
    },
    sectionSpacing: {
      marginBottom: 24,
    },
    alertIcon: {
      marginRight: 8,
      verticalAlign: 'middle',
    },
    summaryCol: {
      marginBottom: 16,
      [theme.breakpoints.up('md')]: {
        marginBottom: 0,
      },
      // Two cards per row from 1024px down (overrides reactstrap col-md-3).
      [`@media ${TABLET_BAND_MEDIA_QUERY}`]: {
        flex: '0 0 50%',
        maxWidth: '50%',
        marginBottom: 24,
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        'marginBottom': 24,
        '&:last-child': {
          marginBottom: 0,
        },
      },
    },
    chartCol: {
      marginBottom: 24,
      [theme.breakpoints.up('lg')]: {
        marginBottom: 0,
      },
    },
    summary: {
      minHeight: 120,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 12,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: '20px 28px',
      backgroundColor: themeColors.cardBg,
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        minHeight: 135,
        borderRadius: BORDER_RADIUS.MEDIUM_SMALL,
        padding: '30px',
        justifyContent: 'flex-start',
        gap: 16,
      },
    },
    summaryText: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.md,
      lineHeight: lineHeights.tight,
      color: themeColors.text,
      textAlign: 'left',
    },
    summaryValue: {
      fontFamily: fontFamily,
      color: themeColors.text,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes['3xl'],
      lineHeight: lineHeights.tight,
      textAlign: 'left',
    },
    trendCard: {
      width: '100%',
      height: '100%',
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: '24px 28px',
      backgroundColor: themeColors.cardBg,
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        'paddingLeft': 0,
        'paddingRight': 0,
        'borderRadius': BORDER_RADIUS.MEDIUM_SMALL,
        '& .card-body': {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    trendCardWithSpacing: {
      marginBottom: 24,
    },
    trendTitle: {
      fontFamily,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      color: themeColors.text,
      marginTop: 0,
      marginBottom: 16,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingLeft: 20,
      },
    },
    emptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    distributionEmptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 250,
    },
  }
})
