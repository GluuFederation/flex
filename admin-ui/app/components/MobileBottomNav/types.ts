import type React from 'react'

export type MobileNavTab = {
  key: string
  titleKey: string
  path?: string
  basePath?: string
  directNav?: boolean
  isMore?: boolean
  icon: React.ReactNode
}

export type MobileBottomNavThemeColors = {
  background: string
  shadow: string
  border: string
  active: string
  inactive: string
}

export type MobileNavSheetThemeColors = {
  background: string
  border: string
  text: string
  listText: string
  title: string
  chip: string
  active: string
  white: string
}
