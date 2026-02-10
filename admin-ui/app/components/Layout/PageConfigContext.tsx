import React from 'react'
import type { PageConfig, ScreenSize } from './types'

const defaultPageConfig: PageConfig = {
  sidebarCollapsed: false,
  screenSize: '' as ScreenSize,
  toggleSidebar: () => {},
  sidebarSlim: false,
  animationsDisabled: false,
}

const PageConfigContext = React.createContext<PageConfig>(defaultPageConfig)

export { PageConfigContext, type PageConfig }
