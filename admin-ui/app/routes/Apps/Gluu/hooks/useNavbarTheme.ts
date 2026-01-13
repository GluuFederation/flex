import { useContext, useMemo, useEffect } from 'react'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

export function useNavbarTheme() {
  const themeContext = useContext(ThemeContext)

  const currentTheme = useMemo(() => {
    return themeContext?.state.theme || 'light'
  }, [themeContext?.state?.theme])

  const themeColors = useMemo(() => {
    return getThemeColor(currentTheme)
  }, [currentTheme])

  const navbarColors = useMemo(() => {
    return themeColors.navbar
  }, [themeColors])

  useEffect(() => {
    const styleId = 'navbar-theme-colors'
    let styleElement = document.getElementById(styleId)
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
        color: ${navbarColors.text} !important;
      }
    `
  }, [navbarColors.text, navbarColors.background, navbarColors.border, navbarColors.icon])

  return {
    currentTheme,
    themeColors,
    navbarColors,
  }
}
