import React from 'react'

import OuterClick from './../OuterClick'
import { withPageConfig } from './../Layout'
import { SidebarContent } from './SidebarContent'
import { SidebarSection } from './SidebarSection'
import { SidebarClose } from './SidebarClose'
import { SidebarMobileFluid } from './SidebarMobileFluid'
import { SidebarShowSlim } from './SidebarShowSlim'
import { SidebarHideSlim } from './SidebarHideSlim'

export interface PageConfig {
  sidebarCollapsed: boolean
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | ''
  toggleSidebar: () => void
  sidebarSlim?: boolean
  animationsDisabled?: boolean
  [key: string]: any // for other dynamic keys like setElementsVisibility, changeMeta, etc
}

export interface SidebarProps {
  children?: React.ReactNode
  slim?: boolean
  collapsed?: boolean
  animationsDisabled?: boolean
  pageConfig: PageConfig
}

const Sidebar: React.FC<SidebarProps> & {
  Section: typeof SidebarSection
  Close: typeof SidebarClose
  MobileFluid: typeof SidebarMobileFluid
  ShowSlim: typeof SidebarShowSlim
  HideSlim: typeof SidebarHideSlim
} = (props) => {
  return (
    <React.Fragment>
      {/* Enable OuterClick only in sidebar overlay mode */}
      <OuterClick
        active={
          !props.pageConfig.sidebarCollapsed &&
          (props.pageConfig.screenSize === 'xs' ||
            props.pageConfig.screenSize === 'sm' ||
            props.pageConfig.screenSize === 'md')
        }
        onClickOutside={() => props.pageConfig.toggleSidebar()}
      >
        <SidebarContent {...props} />
      </OuterClick>
    </React.Fragment>
  )
}

// Attach subcomponents to Sidebar
Sidebar.Section = SidebarSection
Sidebar.Close = SidebarClose
Sidebar.MobileFluid = SidebarMobileFluid
Sidebar.ShowSlim = SidebarShowSlim
Sidebar.HideSlim = SidebarHideSlim

const cfgSidebar = withPageConfig(Sidebar)

export { cfgSidebar as Sidebar }
