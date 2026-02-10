import type React from 'react'

export type Breakpoint = {
  min?: number
  max?: number
}

export type ResponsiveBreakpoints = {
  [key: string]: Breakpoint
}

export type FavIconItem = {
  rel?: string
  href: string
}

export type LayoutProps = {
  children: React.ReactNode
  sidebarSlim?: boolean
  location: {
    pathname: string
  }
  favIcons?: FavIconItem[]
}

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | ''

export type LayoutState = {
  sidebarHidden: boolean
  navbarHidden: boolean
  footerHidden: boolean
  sidebarCollapsed: boolean
  screenSize: ScreenSize
  animationsDisabled: boolean
  pageTitle: string | null
  pageDescription: string
  pageKeywords: string
}

export type LayoutPartComponentType = {
  layoutPartName: string
}

export type PageConfig = {
  sidebarCollapsed: boolean
  screenSize?: ScreenSize
  toggleSidebar: () => void
  sidebarSlim?: boolean
  animationsDisabled?: boolean
  setElementsVisibility?: (
    elements: Partial<Pick<LayoutState, 'sidebarHidden' | 'navbarHidden' | 'footerHidden'>>,
  ) => void
  changeMeta?: (metaData: Partial<LayoutState>) => void
  sidebarHidden?: boolean
  navbarHidden?: boolean
  footerHidden?: boolean
  pageTitle?: string | null
  pageDescription?: string
  pageKeywords?: string
}

export type LayoutNavbarProps = {
  children: React.ReactNode
}

export type LayoutSidebarProps = {
  children?: React.ReactNode
  sidebarSlim?: boolean
  sidebarCollapsed?: boolean
}

export type LayoutContentProps = {
  children: React.ReactNode
}

/** Meta config passed to setupPage / changeMeta */
export type PageMetaConfig = {
  pageTitle?: string | null
  pageDescription?: string
  pageKeywords?: string
  changeMeta?: (config: PageMetaConfig) => void
}

export type PageSetupWrapProps = {
  pageConfig: PageConfig
}
