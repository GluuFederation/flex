import { Layout } from './Layout'
import { LayoutContent } from './LayoutContent'
import { LayoutNavbar } from './LayoutNavbar'
import { LayoutSidebar } from './LayoutSidebar'
import { withPageConfig } from './withPageConfig'
import { setupPage } from './setupPage'

type LayoutWithSubcomponentsType = typeof Layout & {
  Sidebar: typeof LayoutSidebar
  Navbar: typeof LayoutNavbar
  Content: typeof LayoutContent
}

const LayoutWithSubcomponents: LayoutWithSubcomponentsType = Object.assign(Layout, {
  Sidebar: LayoutSidebar,
  Navbar: LayoutNavbar,
  Content: LayoutContent,
})

export default LayoutWithSubcomponents
export { withPageConfig, setupPage }
