import customColors from '@/customColors'
import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'

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
        border: '1.5px solid transparent',
        backgroundImage: `
          linear-gradient(${themeColors.cardBg}, ${themeColors.cardBg}),
          linear-gradient(35deg, ${customColors.darkBorderGradientStart} 0%, ${customColors.darkBorderGradientMid} 50%, ${customColors.darkBorderGradientEnd} 100%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }
    }
    return {
      border: `1.5px solid ${themeColors.cardBorder}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
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
      fontWeight: 500,
      fontSize: 22,
      lineHeight: '22px',
      color: themeColors.text,
      marginBottom: 0,
      position: 'absolute',
      top: '42.5px',
      left: '38.5px',
    },
    summaryIcon: {
      height: '30px',
      width: '30px',
      position: 'relative',
      display: 'flex',
    },
    summaryValue: {
      color: themeColors.text,
      fontWeight: 600,
      fontSize: 48,
      lineHeight: '22px',
      display: 'flex',
      position: 'absolute',
      top: '109px',
      left: '38.5px',
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
      fontSize: 20,
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
      padding: '0 20px',
    },
    reportTitle: {
      fontSize: 20,
    },
    detailReportImg: {
      width: '70%',
      height: '60%',
      marginRight: 10,
    },
    userInfo: {
      borderRadius: 16,
      minHeight: 462,
      color: themeColors.text,
      backgroundColor: themeColors.cardBg,
      ...cardBorderStyle,
      padding: '31.5px',
      position: 'relative',
    },
    userInfoTitle: {
      fontWeight: 500,
      fontSize: 22,
      lineHeight: '22px',
      marginBottom: 0,
      color: themeColors.text,
      fontFamily: "'Mona-Sans', sans-serif",
      position: 'absolute',
      top: '23.5px',
      left: '31.5px',
    },
    userInfoContent: {
      position: 'absolute',
      top: '67.5px',
      left: '31.5px',
      width: '402px',
    },
    userInfoRow: {
      position: 'relative',
      height: '63px',
      marginBottom: '30px',
    },
    userInfoRowLast: {
      marginBottom: 0,
    },
    userInfoItem: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      top: 0,
    },
    userInfoItemLeft: {
      left: 0,
    },
    userInfoItemRight: {
      left: '260px',
    },
    userInfoText: {
      fontSize: 16,
      lineHeight: '32px',
      marginBottom: 0,
      color: themeColors.text,
      fontWeight: 500,
      fontFamily: "'Mona-Sans', sans-serif",
    },
    userInfoValue: {
      fontSize: 20,
      lineHeight: '32px',
      color: themeColors.text,
      fontWeight: 700,
      fontFamily: "'Mona-Sans', sans-serif",
    },
    userInfoStatusContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
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
      padding: 20,
      width: '100%',
      maxWidth: 140,
      display: 'flex',
      marginRight: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      fontSize: 20,
    },
    supportLogo: {
      width: '50%',
    },
    verticalTextContainer: {
      borderRadius: 14,
      color: customColors.white,
      padding: '20px 10px',
      width: '100%',
      maxWidth: 140,
      display: 'flex',
      marginRight: 20,
      justifyContent: 'space-between',
      fontSize: 24,
      flexDirection: 'row',
      fontWeight: 700,
      zIndex: 3,
    },
    textVertical: {
      writingMode: 'vertical-rl',
      textOrientation: 'upright',
    },
    statusSection: {
      width: '100%',
      height: '106px',
      padding: '0 6px',
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
      display: 'flex',
      alignItems: 'center',
      gap: '13px',
      fontSize: 16,
      fontWeight: 600,
      lineHeight: '28px',
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
      color: customColors.orange,
      fontWeight: 600,
    },
    lightBlue: {
      color: customColors.lightBlue,
      fontWeight: 600,
    },
    lightGreen: {
      color: customColors.lightGreen,
      fontWeight: 600,
    },
    whiteBg: {
      background: themeColors.cardBg,
      ...cardBorderStyle,
      padding: '30px',
      color: themeColors.text,
      borderRadius: 16,
      height: 462,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
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
      background: isDark ? customColors.statusActive : customColors.statusActiveBg,
      color: isDark ? customColors.white : customColors.statusActive,
      borderRadius: 5,
      padding: '8px',
      fontSize: 12,
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.2px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      width: 'fit-content',
      height: 'fit-content',
      boxSizing: 'border-box',
    },
    redBlock: {
      background: isDark ? customColors.statusInactive : customColors.statusInactiveBg,
      color: customColors.white,
      borderRadius: 5,
      padding: '8px',
      fontSize: 12,
      fontWeight: 500,
      lineHeight: '24px',
      letterSpacing: '0.2px',
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
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '6px',
      fontSize: 12,
      color: themeColors.text,
      fontFamily: "'Mona-Sans', sans-serif",
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
