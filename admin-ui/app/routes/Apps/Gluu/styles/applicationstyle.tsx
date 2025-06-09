import React from 'react'

export default {
  tableHeaderStyle: {
    backgroundColor: 'rgb(48, 54, 65)',
    color: '#FFF',
    padding: '12px',
    textTransform: 'uppercase',
    fontSize: '16px',
  },
  homeStatTooltip: {
    backgroundColor: '#00C9FF',
    borderRadius: '30px',
    padding: '0px 5px 0px 5px',
    color: 'white',
  },
  buttonStyle: {
    background: '#00a260',
  },
  buttonFlexIconStyles: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  customButtonStyle: {
    background: '#00a260',
    paddingLeft: '20px',
    paddingRight: '30px',
    color: 'white',
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  healthDown: {
    background: 'rgb(241 35 32)',
  },
  healthUp: {
    content: '',
  },
  mainCard: {
    minHeight: '70vh',
    borderRadius: 24,
    padding: 12,
  },
  licensePanel: {
    backgroundColor: '#F5F5F5',
    float: 'left',
  },
  fieldRequired: {
    color: 'red',
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
    transform: 'translateY(-70%)',
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
    backgroundColor: '#F6F6F6',
    borderRadius: '50%',
  },
  persistenceCard: {
    minHeight: '70vh',
    borderRadius: 24,
    padding: 12,
  },
}
