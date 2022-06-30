export const themeConfig = {
  darkBlack: {
    background: '#303641',
    fontColor: '#FFFFFF',
    menu: {
      background: '#323C46',
      color: '#FFFFFF',
    }
  },
  darkBlue: {
    background: '#284461',
    fontColor: '#FFFFFF',
    menu: {
      background: '#323C46',
      color: '#FFFFFF',
    }
  },
  lightBlue: {
    background: '#9DBDE2',
    fontColor: '#303641',
    menu: {
      background: '#274561',
      color: '#FFFFFF',
    }
  },
  lightGreen: {
    background: '#3BC391',
    fontColor: '#303641',
    menu: {
      background: '#02B774',
      color: '#FFFFFF',
    }
  }
}

const getThemeColor = (config) => {
  return themeConfig[config]
}

export default getThemeColor
