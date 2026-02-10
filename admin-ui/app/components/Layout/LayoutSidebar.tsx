import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import type { LayoutSidebarProps } from './types'

const LayoutSidebar: React.FC<LayoutSidebarProps> & { layoutPartName: string } = (props) => {
  const sidebarClass = classNames('layout__sidebar', {
    'layout__sidebar--slim': props.sidebarSlim,
    'layout__sidebar--collapsed': props.sidebarCollapsed,
  })

  return <div className={sidebarClass}>{props.children}</div>
}

LayoutSidebar.propTypes = {
  children: PropTypes.node as React.Validator<React.ReactNode>,
  sidebarSlim: PropTypes.bool,
  sidebarCollapsed: PropTypes.bool,
}
LayoutSidebar.layoutPartName = 'sidebar'

export { LayoutSidebar }
