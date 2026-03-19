import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'

import { withPageConfig } from '../Layout'
import type { SidebarProps } from './types'
import SidebarEntryAnimate from '../dashboard-style-airframe/sidebar-entry-animate'
import SlimSidebarAnimate from '../dashboard-style-airframe/slim-sidebar-animate'
import SlimMenuAnimate from '../dashboard-style-airframe/slim-menu-animate'

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { animationsDisabled = false, pageConfig, slim = false, children } = props

  const sidebarRef = useRef<HTMLDivElement>(null)
  const [entryAnimationFinished, setEntryAnimationFinished] = useState(false)
  const entryAnimateRef = useRef<SidebarEntryAnimate | null>(null)
  const slimAnimateRef = useRef<SlimSidebarAnimate | null>(null)
  const menuAnimateRef = useRef<SlimMenuAnimate | null>(null)

  const animationsEnabled = !(animationsDisabled || pageConfig?.animationsDisabled)

  useEffect(() => {
    if (!animationsEnabled) {
      setEntryAnimationFinished(true)
      return () => {}
    }

    setEntryAnimationFinished(false)
    let cancelled = false

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

    entryAnimate.executeAnimation().then(() => {
      if (!cancelled) setEntryAnimationFinished(true)
    })

    return () => {
      cancelled = true
      entryAnimate.destroy()
      slimAnimate.destroy()
      menuAnimate.destroy()
    }
  }, [animationsEnabled])

  const sidebarClass = classNames(
    'sidebar custom-sidebar-container',
    animationsEnabled && 'sidebar--animations-enabled',
    {
      'sidebar--slim': slim || pageConfig?.sidebarSlim,
      'sidebar--collapsed': pageConfig?.sidebarCollapsed,
      'sidebar--animations-disabled': !animationsEnabled,
      'sidebar--animate-entry-complete': entryAnimationFinished,
    },
  )

  return (
    <div className={sidebarClass} ref={sidebarRef}>
      {children}
    </div>
  )
}

const cfgSidebar = withPageConfig(Sidebar)

export { cfgSidebar as Sidebar }
