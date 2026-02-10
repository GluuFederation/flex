import React, { useContext, useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from '@/context/theme/themeContext'
import getThemeColor, { themeConfig } from '@/context/theme/config'
import customColors, { hexToRgb } from '@/customColors'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'
import type { LayoutContentProps } from './types'

const LayoutContent: React.FC<LayoutContentProps> & { layoutPartName: string } = ({ children }) => {
  const theme = useContext(ThemeContext)
  if (!theme) {
    throw new Error('ThemeContext must be used within a ThemeProvider')
  }
  const selectedTheme = theme.state.theme
  const themeColors = useMemo(() => {
    const colors = getThemeColor(selectedTheme)
    return colors || themeConfig[THEME_LIGHT]
  }, [selectedTheme])
  const layoutElementRef = useRef<HTMLElement | null>(null)

  const isDark = useMemo(() => selectedTheme === THEME_DARK, [selectedTheme])

  const menuColors = useMemo(() => {
    const textColor = isDark ? customColors.white : customColors.textSecondary
    const textColorActive = isDark ? customColors.white : customColors.primaryDark
    const textColorHover = isDark ? customColors.white : customColors.primaryDark
    const hoverBackground = isDark
      ? `rgba(${hexToRgb(customColors.white)}, 0.08)`
      : customColors.sidebarHoverBg

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
      '--theme-navbar-border': themeColors.navbar.border,
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
      '--theme-menu-background-color-hover': menuColors.hoverBackground,
    }),
    [
      themeColors.menu.background,
      themeColors.navbar.background,
      themeColors.navbar.border,
      menuColors.textColor,
      menuColors.textColorActive,
      menuColors.textColorHover,
      menuColors.hoverBackground,
    ],
  )

  useEffect(() => {
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

    const { body } = document
    const { documentElement } = document
    const previousBodyBg = body?.style.backgroundColor || null
    const previousDocElementBg = documentElement?.style.backgroundColor || null

    if (body) {
      body.style.backgroundColor = themeColors.background
    }
    if (documentElement) {
      documentElement.style.backgroundColor = themeColors.background
    }

    return () => {
      if (layoutElementRef.current instanceof HTMLElement) {
        Object.keys(cssVariables).forEach((property) => {
          layoutElementRef.current?.style.removeProperty(property)
        })
      }

      Object.keys(cssVariables).forEach((property) => {
        document.documentElement.style.removeProperty(property)
      })

      if (body) {
        body.style.backgroundColor = previousBodyBg || ''
      }
      if (documentElement) {
        documentElement.style.backgroundColor = previousDocElementBg || ''
      }

      layoutElementRef.current = null
    }
  }, [cssVariables, themeColors.background])

  return (
    <div
      className="layout__content"
      style={
        {
          background: themeColors.background,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

LayoutContent.propTypes = {
  children: PropTypes.node as React.Validator<React.ReactNode>,
}
LayoutContent.layoutPartName = 'content'

export { LayoutContent }
