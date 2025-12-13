// Layout Components TypeScript Type Definitions

// ============================================================================
// Core Layout Component Types
// ============================================================================

// Base props interface for layout components
export interface BaseLayoutComponentProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

// ============================================================================
// Navbar Component Types
// ============================================================================

// Empty props interfaces for components with no specific props
export interface EmptyComponentProps {}

// ============================================================================
// Sidebar Component Types
// ============================================================================

// Default Sidebar component props
export interface DefaultSidebarProps extends EmptyComponentProps {}

// ============================================================================
// Activity Feed Data Types
// ============================================================================

// Activity feed item interface
export interface ActivityFeedItem {
  id: string
  type: 'success' | 'danger' | 'warning' | 'info'
  title: string
  description: string
  timestamp: Date | string
  user?: {
    firstName: string
    lastName: string
  }
}

// Activity feed icon type
export type ActivityFeedIconType = 'success' | 'danger' | 'warning' | 'info'

// Activity feed icon mapping
export interface ActivityFeedIconMap {
  success: React.ReactNode
  danger: React.ReactNode
  warning: React.ReactNode
  info: React.ReactNode
}

// ============================================================================
// Message Data Types
// ============================================================================

// Message item interface
export interface MessageItem {
  id: string
  from: {
    name: string
    avatar?: string
  }
  subject: string
  preview: string
  timestamp: Date | string
  isRead: boolean
  isImportant?: boolean
  messageCount?: number
}

// Message status types
export type MessageStatus = 'unread' | 'read' | 'important' | 'archived'

// Message color types for indicators
export type MessageColorType = 'text-success' | 'text-danger' | 'text-warning'

// ============================================================================
// Navigation Types
// ============================================================================

// Navigation item interface
export interface NavigationItem {
  id: string
  title: string
  icon?: React.ReactNode
  to?: string
  children?: NavigationItem[]
  exact?: boolean
  handleClick?: () => void
  permission?: string
}

// Navigation section interface
export interface NavigationSection {
  title: string
  items: NavigationItem[]
}

// ============================================================================
// Theme and Styling Types
// ============================================================================

// Theme color type
export type ThemeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'white'

// Badge color type
export type BadgeColor = ThemeColor

// ============================================================================
// Event Handler Types
// ============================================================================

// Generic click handler for layout components
export type LayoutClickHandler = (event: React.MouseEvent<HTMLElement>) => void

// Navigation click handler
export type NavigationClickHandler = (item: NavigationItem) => void

// Toggle handler for sidebar/navbar
export type ToggleHandler = () => void

// ============================================================================
// Dropdown Component Types
// ============================================================================

// ============================================================================
// Media Component Types
// ============================================================================

// Media component props
export interface MediaProps extends BaseLayoutComponentProps {}

// Media left/right props
export interface MediaSideProps extends BaseLayoutComponentProps {}

// Media body props
export interface MediaBodyProps extends BaseLayoutComponentProps {}

// ============================================================================
// List Component Types
// ============================================================================

// List group item props
export interface ListGroupItemProps extends BaseLayoutComponentProps {
  action?: boolean
  tag?: React.ElementType
  to?: string
  key?: string | number
}

// ============================================================================
// Badge and Icon Types
// ============================================================================

// Badge props interface
export interface BadgeProps extends BaseLayoutComponentProps {
  color?: BadgeColor
  pill?: boolean
}

// Icon with badge props
export interface IconWithBadgeProps extends BaseLayoutComponentProps {
  badge?: React.ReactNode
}

// ============================================================================
// Form Component Types
// ============================================================================

// Input group props
export interface InputGroupProps extends BaseLayoutComponentProps {}

// Input props
export interface InputProps extends BaseLayoutComponentProps {
  placeholder?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}

// Input group addon props
export interface InputGroupAddonProps extends BaseLayoutComponentProps {
  addonType: 'prepend' | 'append'
}

// Button props
export interface ButtonProps extends BaseLayoutComponentProps {
  color?: ThemeColor
  outline?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: LayoutClickHandler
  type?: 'button' | 'submit' | 'reset'
}

// ============================================================================
// Avatar Component Types
// ============================================================================

// Avatar image props
export interface AvatarImageProps extends BaseLayoutComponentProps {
  src: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
}

// ============================================================================
// Utility Types
// ============================================================================

// Extended from BaseLayoutComponentProps for consistency
export interface CommonProps extends BaseLayoutComponentProps {}

// Navigation link props
export interface NavigationLinkProps extends BaseLayoutComponentProps {
  to: RoutePath
  exact?: boolean
}

// ============================================================================
// Redux Integration Types
// ============================================================================

// Audit log action payload
export interface AuditLogAction {
  message: string
  timestamp?: Date
  userId?: string
}

// ============================================================================
// Routing Types
// ============================================================================

// Route path type
export type RoutePath = string

// ============================================================================
// Data Fetching Types
// ============================================================================

// Loading state
export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

// Data with loading state
export interface DataWithLoading<T> extends LoadingState {
  data?: T
}

// ============================================================================
// Component State Types
// ============================================================================

// Dropdown state
export interface DropdownState {
  isOpen: boolean
  toggle: () => void
}

// Sidebar state
export interface SidebarState {
  isCollapsed: boolean
  isSlim: boolean
  toggle: () => void
}

// Navbar state
export interface NavbarState {
  isOpen: boolean
  toggle: () => void
}
