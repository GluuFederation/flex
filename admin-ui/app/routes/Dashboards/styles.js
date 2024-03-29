import { makeStyles } from 'tss-react/mui'

const styles = makeStyles()({
  root: {
    color: '#FFFFFF',
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
    height: 41,
    maxWidth: 270,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 0,
    border: '3px solid #FFF',
    borderRadius: 10,
    background: 'transparent',
    color: '#FFF',
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryText: {
    paddingLeft: 8,
  },
  summaryValue: {
    background: '#FFF',
    color: '#303641',
    width: 80,
    height: 36,
    fontWeight: 600,
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardCard: {
    background: 'transparent',
    marginTop: 40,
  },
  slider: {
    border: '5px solid #fff',
    borderRadius: 24,
    height: 120,
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    color: '#fff',
    padding: '0px 14px 0px 14px',
  },
  news: {
    borderRadius: 24,
    height: 140,
    background: '#3B6694',
    color: '#FFF',
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
    background: '#FFF',
    color: '#303641',
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
    marginLeft: 20,
    height: 'auto',
    background: '#FFF',
    color: '#303641',
    display: 'block',
    padding: '20px',
    minWidth: 350,
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
    color: '#FFF',
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
    color: '#FFF',
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
    borderRadius: 24,
    height: 280,
    minWidth: 320,
    background: '#FFF',
    color: '#303641',
    display: 'block',
    padding: '20px',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 28,
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconCheck: {
    width: 22,
    height: 22,
    marginLeft: 10,
    marginRight: 10,
  },
  iconCross: {
    width: 18,
    height: 18,
    marginLeft: 10,
    marginRight: 10,
  },
  checkText: {
    color: '#26BC26',
  },
  crossText: {
    color: '#F22222',
  },
  orange: {
    color: '#FE9F01',
    fontWeight: 600,
  },
  lightBlue: {
    color: '#9CBEE0',
    fontWeight: 600,
  },
  lightGreen: {
    color: '#8D9460',
    fontWeight: 600,
  },
  whiteBg: {
    background: '#FFF',
    paddingTop: 30,
    paddingBottom: 20,
    color: '#303641',
    borderRadius: 20,
    height: 430,
  },
  redText: {
    color: '#F22222',
  },
  greenBlock: {
    background: '#25C309',
    color: '#FFF',
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  redBlock: {
    background: '#c30909',
    color: '#FFF',
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
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
