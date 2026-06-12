import React from 'react'
import clsx from 'clsx'
import type { LayoutSidebarProps } from './types'

const LayoutSidebar: React.FC<LayoutSidebarProps> & { layoutPartName: string } = (props) => {
  const sidebarClass = clsx('layout__sidebar', {
    'layout__sidebar--slim': props.sidebarSlim,
    'layout__sidebar--collapsed': props.sidebarCollapsed,
  })

  return <div className={sidebarClass}>{props.children}</div>
}

LayoutSidebar.layoutPartName = 'sidebar'

export { LayoutSidebar }
