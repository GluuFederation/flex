import { SidebarMenu } from './SidebarMenu'
import { SidebarMenuItem } from './SidebarMenuItem'
// Add type for static Item property
(SidebarMenu as typeof SidebarMenu & { Item: typeof SidebarMenuItem }).Item = SidebarMenuItem

export { SidebarMenu, SidebarMenuItem }
export default SidebarMenu
