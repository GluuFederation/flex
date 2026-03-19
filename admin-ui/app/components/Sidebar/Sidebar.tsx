import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'

import OuterClick from '../OuterClick'
import { withPageConfig } from '../Layout'
import type { SidebarProps } from './types'
import SidebarEntryAnimate from '../dashboard-style-airframe/sidebar-entry-animate'
import SlimSidebarAnimate from '../dashboard-style-airframe/slim-sidebar-animate'
import SlimMenuAnimate from '../dashboard-style-airframe/slim-menu-animate'

const Sidebar: React.FC<SidebarProps> = (props) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [entryAnimationFinished, setEntryAnimationFinished] = useState(false)
  const entryAnimateRef = useRef<SidebarEntryAnimate | null>(null)
  const slimAnimateRef = useRef<SlimSidebarAnimate | null>(null)
  const menuAnimateRef = useRef<SlimMenuAnimate | null>(null)

  useEffect(() => {
    const entryAnimate = new SidebarEntryAnimate()
    const slimAnimate = new SlimSidebarAnimate()
    const menuAnimate = new SlimMenuAnimate()
    entryAnimateRef.current = entryAnimate
    slimAnimateRef.current = slimAnimate
    menuAnimateRef.current = menuAnimate

    if (sidebarRef.current) {
      entryAnimate.assignParentElement(sidebarRef.current)
      slimAnimate.assignParentElement(sidebarRef.current)
      menuAnimate.assignSidebarElement(sidebarRef.current)
    }

    entryAnimate.executeAnimation().then(() => setEntryAnimationFinished(true))

    return () => {
      entryAnimate.destroy()
      slimAnimate.destroy()
      menuAnimate.destroy()
    }
  }, [])

  const {
    animationsDisabled = false,
    collapsed = false,
    pageConfig,
    slim = false,
    children,
  } = props

  const sidebarClass = classNames(
    'sidebar custom-sidebar-container',
    'sidebar--animations-enabled',
    {
      'sidebar--slim': slim || pageConfig.sidebarSlim,
      'sidebar--collapsed': collapsed || pageConfig.sidebarCollapsed,
      'sidebar--animations-disabled': animationsDisabled || pageConfig.animationsDisabled,
      'sidebar--animate-entry-complete': entryAnimationFinished,
    },
  )

  return (
    <OuterClick active={false}>
      <div className={sidebarClass} ref={sidebarRef}>
        {children}
      </div>
    </OuterClick>
  )
}

const cfgSidebar = withPageConfig(Sidebar)

export { cfgSidebar as Sidebar }
