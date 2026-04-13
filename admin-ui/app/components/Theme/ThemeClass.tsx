import React from 'react'
import { Consumer } from './ThemeContext'
import type { ThemeContextState } from './types'

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
> = (otherProps) => (
  <Consumer>
    {(themeState: ThemeContextState | null) =>
      themeState ? <ThemeClass {...{ ...themeState, ...otherProps }} /> : null
    }
  </Consumer>
)

export { ContextThemeClass as ThemeClass }
