export const themeConfig = {
  darkBlack: {
    background: '#303641',
    fontColor: '#FFFFFF',
    menu: {
      background: '#323C46',
      color: '#FFFFFF',
    },
    dashboard: {
      supportCard: '#274560'
    }
  },
  darkBlue: {
    background: '#284461',
    fontColor: '#FFFFFF',
    menu: {
      background: '#323C46',
      color: '#FFFFFF',
    },
    dashboard: {
      supportCard: '#9DBDE2'
    }
  },
  lightBlue: {
    background: '#9DBDE2',
    fontColor: '#303641',
    menu: {
      background: '#274561',
      color: '#FFFFFF',
    },
    dashboard: {
      supportCard: '#274560'
    }
  },
  lightGreen: {
    background: '#3BC391',
    fontColor: '#303641',
    menu: {
      background: '#02B774',
      color: '#FFFFFF',
    },
    dashboard: {
      supportCard: '#274560'
    }
  }
}

const getThemeColor = (config) => {
  return themeConfig[config]
}

export default getThemeColor
