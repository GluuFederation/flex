import customColors from '@/customColors'
import {
  OPACITY,
  MOBILE_MEDIA_QUERY,
  SPACING,
  TABLET_MAX_MEDIA_QUERY,
  TABLET_BAND_MEDIA_QUERY,
  DESKTOP_NARROW_MEDIA_QUERY,
  STATUS_GRID_MEDIA_QUERY,
  WIDE_MAX_MEDIA_QUERY,
} from '@/constants'
import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { BORDER_RADIUS, USER_INFO_CHART_BREAKPOINT } from './constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

export { MOBILE_MEDIA_QUERY }

interface DashboardThemeColors {
  cardBg: string
  cardBorder: string
  text: string
  textSecondary: string
  statusCardBg: string
  statusCardBorder: string
  statusActive: string
}

const useStyles = makeStyles<{ themeColors: DashboardThemeColors; isDark: boolean }>()((
  theme: Theme,
  params,
) => {
  const { themeColors, isDark } = params

  const cardBorderStyle = getCardBorderStyle({
    isDark,
  })

  return {
    mobileContentPad: {
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        marginTop: `-${SPACING.PAGE / 2}px`,
        boxSizing: 'border-box',
      },
    },
    mobilePageTitle: {
      fontFamily,
      fontSize: fontSizes.pageTitle,
      fontStyle: 'normal',
      fontWeight: fontWeights.bold,
      lineHeight: 'normal',
      color: isDark ? customColors.white : themeColors.text,
      margin: 0,
      marginBottom: SPACING.PAGE,
    },
    summarySectionTitle: {
      fontFamily,
      fontSize: fontSizes.content,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: '22px',
      color: isDark ? customColors.white : themeColors.text,
      margin: 0,
      marginBottom: `${SPACING.CARD_BUTTON_GAP / 2}px`,
    },
    dashboardSections: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      width: '100%',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        gap: SPACING.SECTION_GAP,
      },
    },
    summaryCards: {
      display: 'grid',
      gap: 16,
      gridTemplateColumns: '1fr',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      },
    },
    flex: {
      flexGrow: 1,
      display: 'flex',
    },
    block: {
      display: 'block',
    },
    summary: {
      height: 180,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: '38.5px',
      backgroundColor: themeColors.cardBg,
      position: 'relative',
      [`@media ${TABLET_BAND_MEDIA_QUERY}`]: {
        height: 'auto',
        minHeight: 120,
        justifyContent: 'flex-start',
        gap: '12px',
        padding: '24px 26px',
      },
      [`@media ${DESKTOP_NARROW_MEDIA_QUERY}`]: {
        height: 'auto',
        minHeight: 140,
        justifyContent: 'flex-start',
        gap: '12px',
        padding: '24px 26px',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        height: 'auto',
        minHeight: 136,
        justifyContent: 'flex-start',
        gap: '16px',
        padding: '28px 29px',
      },
    },
    summaryText: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      color: themeColors.text,
      marginBottom: 0,
      position: 'absolute',
      top: '44px',
      left: '40px',
      [`@media ${TABLET_BAND_MEDIA_QUERY}`]: {
        position: 'static',
        top: 'auto',
        left: 'auto',
        fontSize: fontSizes.md,
        lineHeight: '22px',
      },
      [`@media ${DESKTOP_NARROW_MEDIA_QUERY}`]: {
        position: 'static',
        top: 'auto',
        left: 'auto',
        fontSize: fontSizes.lg,
        lineHeight: '22px',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        position: 'static',
        top: 'auto',
        left: 'auto',
        fontSize: fontSizes.lg,
        lineHeight: '22px',
      },
    },
    summaryIcon: {
      height: '30px',
      width: '30px',
      position: 'relative',
      display: 'flex',
    },
    summaryValue: {
      fontFamily,
      color: themeColors.text,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes['4xl'],
      lineHeight: lineHeights.tight,
      display: 'flex',
      position: 'absolute',
      top: '110px',
      left: '40px',
      transform: 'translateY(-50%)',
      [`@media ${TABLET_BAND_MEDIA_QUERY}`]: {
        position: 'static',
        top: 'auto',
        left: 'auto',
        transform: 'none',
        fontSize: fontSizes['2xl'],
        lineHeight: '1',
      },
      [`@media ${DESKTOP_NARROW_MEDIA_QUERY}`]: {
        position: 'static',
        top: 'auto',
        left: 'auto',
        transform: 'none',
        fontSize: fontSizes['3xl'],
        lineHeight: '1',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        position: 'static',
        top: 'auto',
        left: 'auto',
        transform: 'none',
        fontSize: fontSizes['3xl'],
        lineHeight: '1',
      },
    },
    dashboardCard: {
      background: 'transparent',
      marginTop: 0,
    },
    dashboardCardCentered: {
      display: 'flex',
      justifyContent: 'center',
    },
    slider: {
      border: `5px solid ${customColors.white} `,
      borderRadius: BORDER_RADIUS.LARGE,
      height: 120,
      background: customColors.darkGray,
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'center',
      color: customColors.white,
      padding: '0px 14px 0px 14px',
    },
    news: {
      borderRadius: BORDER_RADIUS.LARGE,
      height: 140,
      background: customColors.lightBlue,
      color: customColors.white,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    newsTitle: {
      fontFamily,
      fontSize: fontSizes.lg,
    },
    logo: {
      width: '40%',
      height: '40%',
      marginBottom: 10,
    },
    reports: {
      borderRadius: BORDER_RADIUS.LARGE,
      marginLeft: 20,
      height: 140,
      background: customColors.white,
      color: customColors.darkGray,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0px 20px',
    },
    reportTitle: {
      fontFamily,
      fontSize: fontSizes.lg,
    },
    detailReportImg: {
      width: '70%',
      height: '60%',
      marginRight: 10,
    },
    userInfo: {
      borderRadius: BORDER_RADIUS.DEFAULT,
      color: themeColors.text,
      backgroundColor: themeColors.cardBg,
      ...cardBorderStyle,
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      height: 462,
      boxSizing: 'border-box',
      [theme.breakpoints.down('md')]: {
        padding: '20px',
        height: 'auto',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        padding: '28px',
        height: 'auto',
      },
    },
    userInfoTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      margin: 0,
      marginBottom: '24px',
      color: themeColors.text,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.medium,
        lineHeight: '22px',
        marginBottom: '20px',
        color: isDark ? customColors.white : themeColors.text,
      },
    },
    userInfoContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: '120px',
      rowGap: '30px',
      width: '100%',
      maxWidth: '100%',
      [`@media ${WIDE_MAX_MEDIA_QUERY}`]: {
        columnGap: '80px',
      },
      [theme.breakpoints.down('md')]: {
        columnGap: '40px',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        gridTemplateColumns: '1fr 1fr',
        columnGap: '24px',
        rowGap: '15px',
      },
    },
    userInfoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        gap: 0,
      },
    },
    userInfoText: {
      fontFamily,
      fontSize: fontSizes.md,
      lineHeight: lineHeights.loose,
      marginBottom: 0,
      color: themeColors.text,
      fontWeight: fontWeights.medium,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: fontSizes.base,
        lineHeight: '26px',
        color: isDark ? customColors.white : themeColors.text,
      },
    },
    userInfoValue: {
      fontFamily,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.loose,
      color: themeColors.text,
      fontWeight: fontWeights.bold,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: fontSizes.md,
        lineHeight: '26px',
        color: isDark ? customColors.white : themeColors.text,
      },
    },
    chartContainerTable: {
      width: 780,
      maxWidth: '63vw',
      height: 'max-content',
    },
    supportContainer: {
      display: 'flex',
      marginLeft: 20,
    },
    supportCard: {
      borderRadius: BORDER_RADIUS.MEDIUM,
      color: customColors.white,
      padding: '20px',
      width: '100%',
      maxWidth: 140,
      display: 'flex',
      marginRight: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      fontSize: fontSizes.lg,
    },
    supportLogo: {
      width: '50%',
    },
    verticalTextContainer: {
      fontFamily,
      borderRadius: BORDER_RADIUS.MEDIUM,
      color: customColors.white,
      padding: '20px 10px',
      width: '100%',
      maxWidth: 140,
      display: 'flex',
      marginRight: 20,
      justifyContent: 'space-between',
      fontSize: fontSizes['2xl'],
      flexDirection: 'row',
      fontWeight: fontWeights.bold,
      zIndex: 3,
    },
    textVertical: {
      writingMode: 'vertical-rl',
      textOrientation: 'upright',
    },
    statusSection: {
      width: '100%',
      padding: 0,
      marginLeft: 0,
      marginRight: 0,
      marginBottom: `${SPACING.SECTION_GAP}px`,
      display: 'flex',
      alignItems: 'flex-start',
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        height: 'auto',
      },
    },
    topGridNoMargin: {
      marginBottom: 0,
    },
    statusContainer: {
      width: '100%',
      color: themeColors.text,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      columnGap: '40px',
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        columnGap: '25px',
        rowGap: '4px',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        '& > span:first-of-type': {
          flexBasis: '100%',
          marginBottom: `${SPACING.CARD_CONTENT_GAP}px`,
        },
      },
    },
    statusTitle: {
      fontFamily,
      fontSize: fontSizes.md,
      fontStyle: 'normal',
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.relaxed,
      color: themeColors.text,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        fontSize: fontSizes.base,
      },
    },
    statusHeading: {
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        flexBasis: '100%',
        marginBottom: '8px',
        fontFamily,
        fontSize: fontSizes.content,
        fontStyle: 'normal',
        fontWeight: fontWeights.medium,
        lineHeight: '22px',
        color: isDark ? customColors.white : themeColors.text,
      },
    },
    statusItems: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      columnGap: '40px',
      rowGap: '8px',
      [`@media ${STATUS_GRID_MEDIA_QUERY}`]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      },
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        columnGap: '25px',
        rowGap: '8px',
      },
    },
    statusIndicator: {
      fontFamily,
      display: 'flex',
      alignItems: 'center',
      gap: '13px',
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.relaxed,
      color: themeColors.text,
      flex: '0 0 auto',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        gap: '6px',
      },
    },
    statusDot: {
      width: 16,
      height: 16,
      borderRadius: BORDER_RADIUS.CIRCLE,
      flexShrink: 0,
      [`@media ${TABLET_MAX_MEDIA_QUERY}`]: {
        width: 10,
        height: 10,
      },
    },
    statusDotActive: {
      backgroundColor: themeColors.statusActive,
    },
    statusDotInactive: {
      backgroundColor: customColors.statusInactive,
    },
    iconCheck: {
      width: 30,
      height: 30,
      marginTop: '10px',
    },
    iconCross: {
      width: 30,
      height: 30,
      marginTop: '10px',
    },
    checkText: {
      color: customColors.logo,
    },
    crossText: {
      color: customColors.accentRed,
    },
    orange: {
      fontFamily,
      color: customColors.orange,
      fontWeight: fontWeights.semiBold,
    },
    lightBlue: {
      fontFamily,
      color: customColors.lightBlue,
      fontWeight: fontWeights.semiBold,
    },
    lightGreen: {
      fontFamily,
      color: customColors.lightGreen,
      fontWeight: fontWeights.semiBold,
    },
    whiteBg: {
      background: themeColors.cardBg,
      ...cardBorderStyle,
      padding: '30px',
      color: themeColors.text,
      borderRadius: BORDER_RADIUS.DEFAULT,
      height: 462,
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      [theme.breakpoints.down('md')]: {
        padding: '20px',
        height: 'auto',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        padding: '28px',
        height: 'auto',
      },
    },
    chartTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      color: themeColors.text,
      marginBottom: '24px',
      marginTop: 0,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.medium,
        lineHeight: '22px',
        marginBottom: '20px',
        color: isDark ? customColors.white : themeColors.text,
      },
    },
    chartDatePickers: {
      display: 'flex',
      gap: '16px',
      width: '100%',
      marginBottom: '16px',
      boxSizing: 'border-box',
    },
    chartContainer: {
      width: '100%',
      height: '350px',
      position: 'relative',
    },
    chartBackground: {
      position: 'absolute',
      top: '10px',
      left: '40px',
      right: '30px',
      bottom: '40px',
      opacity: OPACITY.HOVER_LIGHT,
      pointerEvents: 'none',
      backgroundImage: `
        linear-gradient(${themeColors.text} 1px, transparent 1px),
        linear-gradient(90deg, ${themeColors.text} 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 0 0',
    },
    redText: {
      color: customColors.accentRed,
    },
    bannerContainer: {
      marginTop: 35,
    },
    desktopChartStyle: {
      width: '100%',
      height: '250px',
      position: 'relative',
      flexShrink: 0,
      marginLeft: 0,
    },
    chartLegend: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      marginTop: '8px',
      padding: '0 8px',
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        gap: '10px',
        padding: 0,
        overflow: 'hidden',
        maxWidth: '100%',
      },
    },
    userInfoChartRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      width: '100%',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        gap: SPACING.SECTION_GAP,
      },
      [`@media (min-width: ${USER_INFO_CHART_BREAKPOINT}px)`]: {
        flexDirection: 'row',
      },
    },
    userInfoChartCol: {
      flex: '1 1 100%',
      minWidth: 0,
      [`@media (min-width: ${USER_INFO_CHART_BREAKPOINT}px)`]: {
        '&:first-of-type': { flex: '5 1 0' },
        '&:last-of-type': { flex: '7 1 0' },
      },
    },
    legendItem: {
      fontFamily,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '6px',
      fontSize: fontSizes.sm,
      color: themeColors.text,
      flex: '0 0 auto',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        alignItems: 'flex-start',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
      },
    },
    legendColor: {
      width: '20px',
      height: '3px',
      flexShrink: 0,
      borderRadius: BORDER_RADIUS.THIN,
      backgroundColor: 'var(--legend-swatch-color)',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        marginTop: '8px',
      },
    },
    legendLabel: {
      fontFamily,
      fontSize: fontSizes.sm,
      color: themeColors.text,
      whiteSpace: 'nowrap',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        flex: 1,
        minWidth: 0,
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
      },
    },
  }
})

export { useStyles }
