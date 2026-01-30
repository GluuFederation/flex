import { useContext, useMemo, useEffect } from 'react'
import { ThemeContext } from '@/context/theme/themeContext'
import getThemeColor, { themeConfig } from '@/context/theme/config'
import { THEME_LIGHT, DEFAULT_THEME, isValidTheme } from '@/context/theme/constants'

export function useNavbarTheme() {
  const themeContext = useContext(ThemeContext)

  const currentTheme = useMemo(() => {
    const theme = themeContext?.state?.theme
    return theme && isValidTheme(theme) ? theme : DEFAULT_THEME
  }, [themeContext?.state?.theme])

  const themeColors = useMemo(() => {
    const colors = getThemeColor(currentTheme)
    return colors || themeConfig[THEME_LIGHT]
  }, [currentTheme])

  const navbarColors = useMemo(() => {
    return themeColors?.navbar || themeConfig[THEME_LIGHT].navbar
  }, [themeColors])

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-navbar-text', navbarColors.text)
    const styleId = 'navbar-theme-colors'
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      styleElement.dataset.navbarThemeCount = '0'
      document.head.appendChild(styleElement)
    }

    const currentCount = parseInt(styleElement.dataset.navbarThemeCount || '0', 10)
    styleElement.dataset.navbarThemeCount = String(currentCount + 1)

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
      const element = document.getElementById(styleId) as HTMLStyleElement | null
      if (element) {
        const count = parseInt(element.dataset.navbarThemeCount || '0', 10)
        const newCount = Math.max(0, count - 1)
        element.dataset.navbarThemeCount = String(newCount)

        if (newCount === 0 && element.parentNode) {
          element.parentNode.removeChild(element)
        }
      }
    }
  }, [navbarColors.text])

  return {
    currentTheme,
    themeColors,
    navbarColors,
  }
}
