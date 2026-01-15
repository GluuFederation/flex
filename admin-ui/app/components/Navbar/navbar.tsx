import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { Navbar as BSNavbar, Container } from 'reactstrap'
import { THEME_LIGHT, THEME_DARK, type ThemeValue, DEFAULT_THEME } from '@/context/theme/constants'

interface NavbarProps {
  fluid?: boolean
  shadow?: boolean
  className?: string
  children?: ReactNode
  color?: string
  theme?: ThemeValue
  dark?: boolean
  light?: boolean
  [key: string]: unknown // for ...otherProps
}

const Navbar: React.FC<NavbarProps> = ({
  fluid = false,
  shadow,
  className,
  children,
  theme,
  dark: darkProp,
  light: lightProp,
  color,
  ...otherProps
}) => {
  const isDark = theme === THEME_DARK || (theme === undefined && darkProp === true)
  const isLight = theme === THEME_LIGHT || (theme === undefined && lightProp === true)

  let navbarClass = classNames(
    {
      'navbar-shadow': shadow,
    },
    'navbar-multi-collapse',
    className,
  )

  if (color) {
    const themeStr = isLight ? THEME_LIGHT : isDark ? THEME_DARK : DEFAULT_THEME
    navbarClass = classNames(navbarClass, `navbar-${themeStr}-${color}`)
  }

  return (
    <BSNavbar
      className={navbarClass}
      dark={isDark && !color}
      light={isLight && !color}
      {...otherProps}
    >
      {
        <Container className="navbar-collapse-wrap" fluid={fluid}>
          {children}
        </Container>
      }
    </BSNavbar>
  )
}

export { Navbar }
