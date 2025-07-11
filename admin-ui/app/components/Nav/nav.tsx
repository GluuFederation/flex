import React from 'react'
import classNames from 'classnames'
import { Nav as BsNav, NavProps as BsNavProps } from 'reactstrap'

export interface NavProps extends BsNavProps {
  accent?: boolean
}

const Nav: React.FC<NavProps> = ({ accent = false, className, ...otherProps }) => {
  return (
    <BsNav className={classNames(className, 'nav', { 'nav-accent': accent })} {...otherProps} />
  )
}

export { Nav }
