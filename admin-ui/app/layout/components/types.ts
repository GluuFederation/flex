// Layout Components TypeScript Type Definitions
import type React from 'react'
import type { ThemeValue } from '@/context/theme/constants'

// ============================================================================
// Core Layout Component Types
// ============================================================================

// Base props type for layout components
export type BaseLayoutComponentProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

// ============================================================================
// Navbar Component Types
// ============================================================================

// Empty props type for components with no specific props
export type EmptyComponentProps = Record<string, never>

// ============================================================================
// Sidebar Component Types
// ============================================================================

// Default Sidebar component props
export type DefaultSidebarProps = EmptyComponentProps

// ============================================================================
// Activity Feed Data Types
// ============================================================================

// Activity feed item type
export type ActivityFeedItem = {
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
export type ActivityFeedIconMap = {
  success: React.ReactNode
  danger: React.ReactNode
  warning: React.ReactNode
  info: React.ReactNode
}

// ============================================================================
// Message Data Types
// ============================================================================

// Message item type
export type MessageItem = {
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

// Navigation item type
export type NavigationItem = {
  id: string
  title: string
  icon?: React.ReactNode
  to?: string
  children?: NavigationItem[]
  exact?: boolean
  handleClick?: () => void
  permission?: string
}

// Navigation section type
export type NavigationSection = {
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
  | ThemeValue
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
export type MediaProps = BaseLayoutComponentProps

// Media left/right props
export type MediaSideProps = BaseLayoutComponentProps

// Media body props
export type MediaBodyProps = BaseLayoutComponentProps

// ============================================================================
// List Component Types
// ============================================================================

// List group item props
export type ListGroupItemProps = BaseLayoutComponentProps & {
  action?: boolean
  tag?: React.ElementType
  to?: string
  key?: string | number
}

// ============================================================================
// Badge and Icon Types
// ============================================================================

// Badge props type
export type BadgeProps = BaseLayoutComponentProps & {
  color?: BadgeColor
  pill?: boolean
}

// Icon with badge props
export type IconWithBadgeProps = BaseLayoutComponentProps & {
  badge?: React.ReactNode
}

// ============================================================================
// Form Component Types
// ============================================================================

// Input group props
export type InputGroupProps = BaseLayoutComponentProps

// Input props
export type InputProps = BaseLayoutComponentProps & {
  placeholder?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}

// Input group addon props
export type InputGroupAddonProps = BaseLayoutComponentProps & {
  addonType: 'prepend' | 'append'
}

// Button props
export type ButtonProps = BaseLayoutComponentProps & {
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
export type AvatarImageProps = BaseLayoutComponentProps & {
  src: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
}

// ============================================================================
// Utility Types
// ============================================================================

// Extended from BaseLayoutComponentProps for consistency
export type CommonProps = BaseLayoutComponentProps

// Navigation link props
export type NavigationLinkProps = BaseLayoutComponentProps & {
  to: RoutePath
  exact?: boolean
}

// ============================================================================
// Redux Integration Types
// ============================================================================

// Audit log action payload
export type AuditLogAction = {
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
export type LoadingState = {
  isLoading: boolean
  error?: string | null
}

// Data with loading state
export type DataWithLoading<T> = LoadingState & {
  data?: T
}

// ============================================================================
// Component State Types
// ============================================================================

// Dropdown state
export type DropdownState = {
  isOpen: boolean
  toggle: () => void
}

// Sidebar state
export type SidebarState = {
  isCollapsed: boolean
  isSlim: boolean
  toggle: () => void
}

// Navbar state
export type NavbarState = {
  isOpen: boolean
  toggle: () => void
}
