import React, { useContext, useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { ReactNode } from 'react'
import customColors from '@/customColors'

interface LayoutContentProps {
  children: ReactNode
}

const SELECTORS = [
  'h1, h2, h3, h4, h5, h6',
  '.page-title, #page-title',
  '.card-header, .custom-card-header:not(.custom-card-header--background), .card-header h1, .card-header h2, .card-header h3, .card-header h4, .card-header h5, .card-header h6',
  'thead th, .table thead th, table thead th',
  '.form-section-title, .section-title, .form-title',
] as const

const STYLE_ID = 'layout-content-theme-colors'

const LayoutContent = ({ children }: LayoutContentProps) => {
  const theme = useContext(ThemeContext)
  if (!theme) {
    throw new Error('ThemeContext must be used within a ThemeProvider')
  }
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const layoutElementRef = useRef<HTMLElement | null>(null)

  const isDark = useMemo(() => selectedTheme === 'dark', [selectedTheme])

  const menuColors = useMemo(() => {
    const textColor = isDark ? customColors.white : customColors.textSecondary
    const textColorActive = isDark ? customColors.white : customColors.primaryDark
    const textColorHover = isDark ? customColors.white : customColors.primaryDark
    const hoverBackground = isDark ? customColors.hoverBgDark : customColors.sidebarHoverBg

    return {
      textColor,
      textColorActive,
      textColorHover,
      hoverBackground,
    }
  }, [isDark])

  const cssVariables = useMemo(
    () => ({
      '--theme-sidebar-background': themeColors.menu.background,
      '--theme-navbar-background': themeColors.navbar.background,
      '--theme-menu-icon-color': menuColors.textColor,
      '--theme-menu-icon-color-active': menuColors.textColorActive,
      '--theme-menu-icon-color-hover': menuColors.textColorHover,
      '--theme-menu-text-color': menuColors.textColor,
      '--theme-menu-text-color-active': menuColors.textColorActive,
      '--theme-menu-text-color-hover': menuColors.textColorHover,
      '--theme-menu-arrow-color': menuColors.textColor,
      '--theme-menu-arrow-color-active': menuColors.textColorActive,
      '--theme-menu-arrow-color-hover': menuColors.textColorHover,
      '--theme-menu-hover-background': menuColors.hoverBackground,
    }),
    [
      themeColors.menu.background,
      themeColors.navbar.background,
      menuColors.textColor,
      menuColors.textColorActive,
      menuColors.textColorHover,
      menuColors.hoverBackground,
    ],
  )

  useEffect(() => {
    let styleElement = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = STYLE_ID
      document.head.appendChild(styleElement)
    }

    if (!layoutElementRef.current) {
      layoutElementRef.current = document.querySelector('.layout')
    }

    const setCSSVariables = (element: HTMLElement) => {
      Object.entries(cssVariables).forEach(([property, value]) => {
        element.style.setProperty(property, value)
      })
    }

    if (layoutElementRef.current instanceof HTMLElement) {
      setCSSVariables(layoutElementRef.current)
    }
    setCSSVariables(document.documentElement)

    styleElement.textContent = SELECTORS.map(
      (selector) => `.layout__content ${selector} { color: ${themeColors.fontColor} !important; }`,
    ).join('\n')

    const { body } = document
    const { documentElement } = document
    if (body) {
      body.style.backgroundColor = themeColors.background
    }
    if (documentElement) {
      documentElement.style.backgroundColor = themeColors.background
    }
  }, [cssVariables, themeColors.fontColor, themeColors.background])

  return (
    <div
      className="layout__content"
      style={
        {
          'background': themeColors.background,
          'color': themeColors.fontColor,
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
