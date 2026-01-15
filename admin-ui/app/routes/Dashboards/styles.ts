import customColors from '@/customColors'
import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { fontFamily, fontWeights, fontSizes, letterSpacing, lineHeights } from '@/styles/fonts'

interface DashboardThemeColors {
  cardBg: string
  cardBorder: string
  text: string
  textSecondary: string
  background: string
  statusCardBg: string
  statusCardBorder: string
}

const styles = makeStyles<{ themeColors: DashboardThemeColors; isDark: boolean }>()((
  theme: Theme,
  params,
) => {
  const { themeColors, isDark } = params

  const getCardBorderStyle = () => {
    if (isDark) {
      return {
        border: `1.5px solid ${customColors.darkBorderAccent}`,
      }
    }
    return {
      border: `1.5px solid ${themeColors.cardBorder}`,
      boxShadow: `0px 4px 11px 0px ${customColors.shadowLight}`,
    }
  }

  const cardBorderStyle = getCardBorderStyle()

  return {
    root: {
      maxWidth: '100vw',
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
      borderRadius: 16,
      padding: '38.5px',
      paddingBottom: '38.5px',
      backgroundColor: themeColors.cardBg,
      position: 'relative',
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
    },
    dashboardCard: {
      background: 'transparent',
      marginTop: 0,
    },
    slider: {
      border: `5px solid ${customColors.white} `,
      borderRadius: 24,
      height: 120,
      background: customColors.darkGray,
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'center',
      color: customColors.white,
      padding: '0px 14px 0px 14px',
    },
    news: {
      borderRadius: 24,
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
      borderRadius: 24,
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
      borderRadius: 16,
      color: themeColors.text,
      backgroundColor: themeColors.cardBg,
      ...cardBorderStyle,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      height: 462,
      boxSizing: 'border-box',
      position: 'relative',
      [theme.breakpoints.down('md')]: {
        padding: '20px',
        height: 'auto',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '16px',
        height: 'auto',
      },
    },
    userInfoTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      margin: 0,
      position: 'absolute',
      top: '25px',
      left: '33px',
      color: themeColors.text,
      [theme.breakpoints.down('sm')]: {
        fontSize: fontSizes.lg,
        position: 'relative',
        top: 'auto',
        left: 'auto',
        marginBottom: '24px',
      },
    },
    userInfoContent: {
      display: 'flex',
      flexDirection: 'row',
      gap: '40px',
      width: '100%',
      maxWidth: '100%',
      position: 'absolute',
      top: '69px',
      left: '33px',
      [theme.breakpoints.down('md')]: {
        gap: '30px',
        position: 'relative',
        top: 'auto',
        left: 'auto',
      },
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: '20px',
      },
    },
    userInfoColumn: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 0',
      gap: '24px',
      [theme.breakpoints.down('sm')]: {
        gap: '20px',
      },
    },
    userInfoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    userInfoText: {
      fontFamily,
      fontSize: fontSizes.md,
      lineHeight: lineHeights.loose,
      marginBottom: 0,
      color: themeColors.text,
      fontWeight: fontWeights.medium,
    },
    userInfoValue: {
      fontFamily,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.loose,
      color: themeColors.text,
      fontWeight: fontWeights.bold,
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
      borderRadius: 14,
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
      borderRadius: 14,
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
      height: '106px',
      padding: '0px 6px',
      backgroundColor: themeColors.background,
      marginLeft: 0,
      marginRight: 0,
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        height: '80px',
      },
      [theme.breakpoints.down('sm')]: {
        height: '70px',
      },
    },
    statusContainer: {
      width: '100%',
      color: themeColors.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
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
    },
    statusDot: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      flexShrink: 0,
    },
    statusDotActive: {
      backgroundColor: customColors.statusActive,
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
      padding: '33px',
      color: themeColors.text,
      borderRadius: 16,
      height: 462,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    chartTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      color: themeColors.text,
      marginBottom: '24px',
      marginTop: 0,
    },
    chartDatePickers: {
      display: 'flex',
      gap: '16px',
      width: '100%',
      maxWidth: '516px',
      marginBottom: '16px',
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
      opacity: 0.05,
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
    greenBlock: {
      fontFamily,
      background: isDark ? customColors.statusActive : customColors.statusActiveBg,
      color: isDark ? customColors.white : customColors.statusActive,
      borderRadius: 5,
      padding: '8px',
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.base,
      letterSpacing: letterSpacing.tight,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      width: 'fit-content',
      height: 'fit-content',
      boxSizing: 'border-box',
    },
    redBlock: {
      fontFamily,
      background: isDark ? customColors.statusInactive : customColors.statusInactiveBg,
      color: isDark ? customColors.white : customColors.statusInactive,
      borderRadius: 5,
      padding: '8px',
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.base,
      letterSpacing: letterSpacing.tight,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      width: 'fit-content',
      height: 'fit-content',
      boxSizing: 'border-box',
    },
    bannerContainer: {
      marginTop: 35,
    },
    desktopChartStyle: {
      width: '100%',
      height: '380px',
      position: 'relative',
      flex: 1,
      minHeight: 0,
      marginLeft: 0,
    },
    chartLegend: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: '4px',
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
      whiteSpace: 'nowrap',
    },
    legendColor: {
      width: '20px',
      height: '3px',
      flexShrink: 0,
      borderRadius: '1.5px',
    },
  }
})

export default styles
