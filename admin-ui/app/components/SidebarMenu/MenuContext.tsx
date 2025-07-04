import React from 'react'

// Types for entries and context
interface SidebarMenuEntry {
  id: string
  parentId?: string
  exact: boolean
  url?: string
  open?: boolean
  active?: boolean
}

interface SidebarMenuContext {
  entries: Record<string, SidebarMenuEntry>
  addEntry: (entry: SidebarMenuEntry) => void
  updateEntry: (id: string, stateMods: Partial<SidebarMenuEntry>) => void
  removeEntry: (id: string) => void
}

const MenuContext = React.createContext<SidebarMenuContext>({
  entries: {},
  addEntry: () => {},
  updateEntry: () => {},
  removeEntry: () => {},
})

export { MenuContext, type SidebarMenuContext }
