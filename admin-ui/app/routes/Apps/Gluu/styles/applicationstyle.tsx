import customColors from '@/customColors'

export default {
  tableHeaderStyle: {
    padding: '12px',
    textTransform: 'uppercase',
    fontSize: '16px',
    fontWeight: 400,
  },
  homeStatTooltip: {
    backgroundColor: customColors.lightBlue,
    borderRadius: '30px',
    padding: '0px 5px 0px 5px',
    color: customColors.white,
  },
  buttonStyle: {
    background: customColors.logo,
  },
  buttonFlexIconStyles: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  customButtonStyle: {
    background: customColors.logo,
    paddingLeft: '20px',
    paddingRight: '30px',
    color: customColors.white,
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  healthDown: {
    background: customColors.accentRed,
  },
  healthUp: {
    content: '',
  },
  mainCard: {
    minHeight: '70vh',
    borderRadius: 24,
    padding: '12px',
  },
  verticalDivider: {
    borderRight: `1px solid ${customColors.lightGray}`,
    paddingRight: '32px',
  },
  licensePanel: {
    backgroundColor: customColors.white,
    float: 'left',
  },
  fieldRequired: {
    color: customColors.accentRed,
    fontSize: '22px',
  },
  removableInputRow: {
    float: 'right',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '5px',
    width: '25px',
    height: '25px',
    marginTop: '0px',
    marginRight: '-10px',
  },
  shortCodesWrapperStyles: {
    position: 'absolute',
    right: 0,
    marginRight: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  globalSearch: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  globalSearchPattern: {
    padding: '10px',
    marginTop: '25px',
  },
  toolbar: {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'space-between',
    width: '100%',
    mb: 2,
  },
  innerToolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    position: 'relative',
    zIndex: 15,
    pr: 2,
  },
  filterBlock: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  barIcon: { padding: '4px', height: '32px', width: '32px' },
  hoverBarIcon: {
    backgroundColor: customColors.white,
    borderRadius: '50%',
  },
  persistenceCard: {
    minHeight: '70vh',
    borderRadius: 24,
    padding: '12px',
  },
}
