export const themeConfig = {
  darkBlack: {
    background: '#303641',
    lightBackground: '#989ea7',
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
    lightBackground: '#81a8d0',
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
    lightBackground: '#c9def6',
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
    lightBackground: '#abebd4',
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
