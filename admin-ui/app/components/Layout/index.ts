// @ts-nocheck
import { Layout } from './Layout'
import { LayoutContent } from './LayoutContent'
import { LayoutNavbar } from './LayoutNavbar'
import { LayoutSidebar } from './LayoutSidebar'
import { withPageConfig } from './withPageConfig'
import { setupPage } from './setupPage'

const LayoutWithSubcomponents = Layout as any
LayoutWithSubcomponents.Sidebar = LayoutSidebar
LayoutWithSubcomponents.Navbar = LayoutNavbar
LayoutWithSubcomponents.Content = LayoutContent

export default LayoutWithSubcomponents
export { withPageConfig, setupPage }
