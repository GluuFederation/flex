// @ts-nocheck
import React from 'react'

interface PageConfig {
  sidebarCollapsed: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '';
  toggleSidebar: () => void;
  sidebarSlim?: boolean;
  animationsDisabled?: boolean;
  setElementsVisibility?: (elements: { [key: string]: boolean }) => void;
  changeMeta?: (metaData: Partial<PageConfig>) => void;
  [key: string]: any; // for other dynamic properties
}

const defaultPageConfig: PageConfig = {
  sidebarCollapsed: false,
  screenSize: '',
  toggleSidebar: () => {},
  sidebarSlim: false,
  animationsDisabled: false
}

const PageConfigContext = React.createContext<PageConfig>(defaultPageConfig)

export {
  PageConfigContext,
  type PageConfig
}
