import React, { use } from 'react'
import { ThemeContext } from './ThemeContext'

interface ThemeClassProps {
  children: (layoutThemeClass: string) => React.ReactNode
  color?: string
  style?: string
}

const ThemeClass: React.FC<ThemeClassProps> = ({ children, color, style }) => {
  const layoutThemeClass = `layout--theme--${style}--${color}`
  return children(layoutThemeClass)
}

const ContextThemeClass: React.FC<
  Omit<ThemeClassProps, 'children'> & { children: (layoutThemeClass: string) => React.ReactNode }
> = (otherProps) => {
  const themeState = use(ThemeContext)
  return themeState ? <ThemeClass {...{ ...themeState, ...otherProps }} /> : null
}

export { ContextThemeClass as ThemeClass }
