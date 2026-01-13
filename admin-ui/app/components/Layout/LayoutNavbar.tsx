import React from 'react'

interface LayoutNavbarProps {
  children: React.ReactNode
}

type LayoutNavbarComponent = React.FC<LayoutNavbarProps> & { layoutPartName: string }

const LayoutNavbar: LayoutNavbarComponent = (props) => {
  const navbar = React.Children.only(props.children) as React.ReactElement

  return <div className="layout__navbar">{React.cloneElement(navbar, { fixed: null })}</div>
}

LayoutNavbar.layoutPartName = 'navbar'

export { LayoutNavbar }
