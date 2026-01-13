import React from 'react'

interface LayoutNavbarProps {
  children: React.ReactNode
}

const LayoutNavbar: React.FC<LayoutNavbarProps> = (props) => {
  const navbar = React.Children.only(props.children) as React.ReactElement

  return <div className="layout__navbar">{React.cloneElement(navbar, { fixed: null })}</div>
}

;(LayoutNavbar as React.FC<LayoutNavbarProps> & { layoutPartName: string }).layoutPartName =
  'navbar'

export { LayoutNavbar }
