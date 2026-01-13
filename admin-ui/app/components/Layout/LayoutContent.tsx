import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { ReactNode } from 'react'
import customColors from '@/customColors'

interface LayoutContentProps {
  children: ReactNode
}

const LayoutContent = ({ children }: LayoutContentProps) => {
  const theme = useContext(ThemeContext)
  if (!theme) {
    throw new Error('ThemeContext must be used within a ThemeProvider')
  }
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  useEffect(() => {
    const styleId = 'layout-content-theme-colors'
    let styleElement = document.getElementById(styleId)
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    const isDark = selectedTheme === 'dark'
    const textColor = isDark ? customColors.white : customColors.textSecondary
    const textColorActive = isDark ? customColors.white : customColors.primaryDark
    const textColorHover = isDark ? customColors.white : customColors.primaryDark

    const cssVariables = {
      '--theme-sidebar-background': themeColors.menu.background,
      '--theme-menu-icon-color': textColor,
      '--theme-menu-icon-color-active': textColorActive,
      '--theme-menu-icon-color-hover': textColorHover,
      '--theme-menu-text-color': textColor,
      '--theme-menu-text-color-active': textColorActive,
      '--theme-menu-text-color-hover': textColorHover,
      '--theme-menu-arrow-color': textColor,
      '--theme-menu-arrow-color-active': textColorActive,
      '--theme-menu-arrow-color-hover': textColorHover,
    }

    const setCSSVariables = (element: HTMLElement) => {
      Object.entries(cssVariables).forEach(([property, value]) => {
        element.style.setProperty(property, value)
      })
    }

    const layoutElement = document.querySelector('.layout')
    if (layoutElement instanceof HTMLElement) {
      setCSSVariables(layoutElement)
    }
    setCSSVariables(document.documentElement)

    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      '.page-title, #page-title',
      '.card-header, .custom-card-header:not(.custom-card-header--background), .card-header h1, .card-header h2, .card-header h3, .card-header h4, .card-header h5, .card-header h6',
      'thead th, .table thead th, table thead th',
      '.form-section-title, .section-title, .form-title',
    ]

    styleElement.textContent = selectors
      .map(
        (selector) =>
          `.layout__content ${selector} { color: ${themeColors.fontColor} !important; }`,
      )
      .join('\n')
  }, [themeColors.fontColor, themeColors.menu.background, selectedTheme])

  return (
    <div
      className="layout__content"
      style={
        {
          'background': themeColors.background,
          'color': themeColors.fontColor,
          'height': '100%',
          '--theme-text-color': themeColors.fontColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

LayoutContent.propTypes = {
  children: PropTypes.node,
}
LayoutContent.layoutPartName = 'content'

export { LayoutContent }
