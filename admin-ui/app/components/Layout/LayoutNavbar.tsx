import React from 'react'
import type { LayoutNavbarProps } from './types'

/**
 * LayoutNavbar component expects a single React element child.
 * @param children - A single React element to be rendered in the navbar layout.
 */
type LayoutNavbarComponent = React.FC<LayoutNavbarProps> & { layoutPartName: string }

const LayoutNavbar: LayoutNavbarComponent = (props) => {
  const child = React.Children.only(props.children)

  if (!React.isValidElement(child)) {
    throw new Error('LayoutNavbar expects a single valid React element as a child')
  }

  return <div className="layout__navbar">{React.cloneElement(child, { fixed: null })}</div>
}

LayoutNavbar.layoutPartName = 'navbar'

export { LayoutNavbar }
