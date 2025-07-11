import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { Navbar as BSNavbar, Container } from 'reactstrap'

interface NavbarProps {
  themed?: boolean
  fluid?: boolean
  shadow?: boolean
  className?: string
  children?: ReactNode
  color?: string
  dark?: boolean
  light?: boolean
  [key: string]: any // for ...otherProps
}

const Navbar: React.FC<NavbarProps> = ({
  themed = false,
  fluid = false,
  shadow,
  className,
  children,
  dark,
  light,
  color,
  ...otherProps
}) => {
  let navbarClass = classNames(
    {
      'navbar-shadow': shadow,
    },
    'navbar-multi-collapse',
    className,
  )

  // When a combination of light or dark is present
  // with a color - use a custom class instead of bootstrap's
  if ((dark || light) && color) {
    navbarClass = classNames(
      navbarClass,
      `navbar-${light ? 'light' : ''}${dark ? 'dark' : ''}-${color}`,
    )
  }

  return (
    <BSNavbar
      className={navbarClass}
      /*
                Use the dark and light switches
                only when color is not set
            */
      dark={dark && !color}
      light={light && !color}
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
