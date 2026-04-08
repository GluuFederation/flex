import React from 'react'
import type { SidebarMenuContext } from './types'

const MenuContext = React.createContext<SidebarMenuContext>({
  entries: {},
  addEntry: () => {},
  updateEntry: () => {},
  removeEntry: () => {},
})

export { MenuContext, type SidebarMenuContext }
