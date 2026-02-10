import React from 'react'
import type { PageConfig } from './types'

const defaultPageConfig: PageConfig = {
  sidebarCollapsed: false,
  screenSize: '',
  toggleSidebar: () => {},
  sidebarSlim: false,
  animationsDisabled: false,
}

const PageConfigContext = React.createContext<PageConfig>(defaultPageConfig)

export { PageConfigContext, type PageConfig }
