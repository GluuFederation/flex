import customColors from '@/customColors'
import { makeStyles } from 'tss-react/mui'

const styles = makeStyles()({
  root: {
    color: customColors.white,
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
    height: 'auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    border: `3px solid ${customColors.white} `,
    borderRadius: 5,
    alignItems: 'start',
    flexDirection: 'column',
    padding: '5px 10px',
  },
  summaryText: {
    fontWeight: 600,
  },
  summaryIcon: {
    height: '30px',
    width: '30px',
    marginRight: '10px',
    position: 'relative',
    display: 'flex',
  },
  summaryValue: {
    color: customColors.darkGray,
    width: 50,
    height: 36,
    fontWeight: 600,
    fontSize: 20,
    display: 'flex',
  },
  summaryDetails: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeft: '4px solid black',
    paddingLeft: '10px',
    width: '100%',
  },
  dashboardCard: {
    background: 'transparent',
    marginTop: 40,
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
    borderRadius: 24,
    height: 'auto',
    color: customColors.darkGray,
  },
  userInfoTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 16,
  },
  chartContainer: {
    width: 780,
    maxWidth: '40vw',
    height: 'max-content',
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
  statusContainer: {
    minWidth: 320,
    height: '100%',
    color: customColors.darkGray,
    display: 'block',
  },
  statusText: {
    background: customColors.white,
    width: '48%',
    fontSize: 18,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: 5,
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
    background: customColors.white,
    paddingTop: 30,
    paddingBottom: 20,
    color: customColors.darkGray,
    borderRadius: 20,
    height: 430,
  },
  redText: {
    color: customColors.accentRed,
  },
  greenBlock: {
    background: customColors.logo,
    color: customColors.white,
    borderRadius: 5,
    padding: '5px 10px',
  },
  redBlock: {
    background: customColors.accentRed,
    color: customColors.white,
    borderRadius: 5,
    padding: '5px 10px',
  },
  bannerContainer: {
    marginTop: 35,
  },
  desktopChartStyle: {
    maxWidth: '100%',
    overflowX: 'scroll',
    overflowY: 'hidden',
    scrollBehavior: 'smooth',
  },
})

export default styles
