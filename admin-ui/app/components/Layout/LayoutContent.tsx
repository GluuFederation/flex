// @ts-nocheck
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from 'context/theme/themeContext'
import getThemeColor from 'context/theme/config'
import { ReactNode } from 'react'

interface LayoutContentProps {
  children: ReactNode;
}

const LayoutContent = ({ children }: LayoutContentProps) => {
  const theme = useContext(ThemeContext)
  if (!theme) {
    throw new Error('ThemeContext must be used within a ThemeProvider')
  }
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  return (
    <div className="layout__content" style={{ background: themeColors.background, height:"100%" }}>
      { children }
    </div>
  )
}

LayoutContent.propTypes = {
  children: PropTypes.node
}
LayoutContent.layoutPartName = "content"

export {
  LayoutContent
}
