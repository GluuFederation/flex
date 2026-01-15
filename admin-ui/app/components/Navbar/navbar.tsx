import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { Navbar as BSNavbar, Container } from 'reactstrap'
import { THEME_LIGHT, THEME_DARK, type ThemeValue } from '@/context/theme/constants'

interface NavbarProps {
  themed?: boolean
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
  themed: _themed = false,
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

  // When a combination of light or dark is present
  // with a color - use a custom class instead of bootstrap's
  if ((isDark || isLight) && color) {
    navbarClass = classNames(
      navbarClass,
      `navbar-${isLight ? THEME_LIGHT : ''}${isDark ? THEME_DARK : ''}-${color}`,
    )
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
