import { useContext, useMemo, useEffect } from 'react'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor, { themeConfig } from 'Context/theme/config'

export function useNavbarTheme() {
  const themeContext = useContext(ThemeContext)

  const currentTheme = useMemo(() => {
    const theme = themeContext?.state?.theme
    return theme === 'light' || theme === 'dark' ? theme : 'light'
  }, [themeContext?.state?.theme])

  const themeColors = useMemo(() => {
    const colors = getThemeColor(currentTheme)
    return colors || themeConfig.light
  }, [currentTheme])

  const navbarColors = useMemo(() => {
    return themeColors?.navbar || themeConfig.light.navbar
  }, [themeColors])

  useEffect(() => {
    const styleId = 'navbar-theme-colors'
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null
    const createdByThisEffect = !styleElement

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = `
      .navbar-themed .dropdown-menu,
      .navbar-themed .dropdown-menu.show {
        color: var(--theme-navbar-text) !important;
      }
      .navbar-themed .dropdown-menu .dropdown-item {
        color: var(--theme-navbar-text) !important;
      }
      .navbar-themed .dropdown-menu .dropdown-item:hover,
      .navbar-themed .dropdown-menu .dropdown-item:focus {
        color: var(--theme-navbar-text) !important;
      }
      .navbar-themed .dropdown-menu .dropdown-header {
        color: var(--theme-navbar-text) !important;
      }
      .navbar-themed .dropdown-menu .dropdown-item i {
        color: var(--theme-navbar-text) !important;
      }
      #page-title-navbar {
        color: var(--theme-navbar-text) !important;
      }
    `

    return () => {
      if (createdByThisEffect && styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
  }, [navbarColors.text])

  return {
    currentTheme,
    themeColors,
    navbarColors,
  }
}
