import type { ReactNode, CSSProperties, ReactElement } from 'react'

export type SidebarMenuEntry = {
  id: string
  parentId?: string
  exact: boolean
  url?: string
  open?: boolean
  active?: boolean
}

export type SidebarMenuContext = {
  entries: Record<string, SidebarMenuEntry>
  addEntry: (entry: SidebarMenuEntry) => void
  updateEntry: (id: string, stateMods: Partial<SidebarMenuEntry>) => void
  removeEntry: (id: string) => void
}

export type SidebarMenuItemLinkProps = {
  to?: string | null
  handleClick?: () => void
  href?: string | null
  active?: boolean
  onToggle?: () => void
  children?: ReactNode
  classBase: string
  textStyle?: CSSProperties
  sidebarMenuActive?: string
}

export type SidebarMenuItemProps = {
  parentId?: string
  children?: ReactNode
  isSubNode?: boolean
  currentUrl?: string
  slim?: boolean
  icon?: ReactElement
  title?: string | ReactNode
  to?: string
  href?: string
  exact?: boolean
  noCaret?: boolean
  textStyle?: CSSProperties
  handleClick?: () => void
  sidebarMenuActiveClass?: string
  isEmptyNode?: boolean
}
