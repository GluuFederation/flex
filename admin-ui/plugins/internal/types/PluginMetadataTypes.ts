import type { ComponentType } from 'react'
import type { Reducer } from '@reduxjs/toolkit'
import type { AppStartListening } from '@/redux/listeners'
import type { AdminUiFeatureResource, CedarAction } from '@/cedarling/types'
import type { CEDARLING_BYPASS } from '@/cedarling/constants'
type PluginListenerSetup = (startListening: AppStartListening) => void

export type PluginMenu = {
  title?: string
  icon?: string
  path?: string
  order?: number
  children?: PluginMenu[]
}

type PluginRouteComponent = ComponentType & {
  preload?: () => Promise<{ default: ComponentType }>
}

export type PluginRouteAccess = {
  resourceKey?: AdminUiFeatureResource | typeof CEDARLING_BYPASS
  action?: CedarAction
}

export type PluginRoute = PluginRouteAccess & {
  path: string
  component: PluginRouteComponent
}

export type PluginReducer = {
  name: string
  reducer: Reducer
}

export type PluginMetadataModule = {
  default?: {
    menus?: PluginMenu[]
    routes?: PluginRoute[]
    reducers?: PluginReducer[]
    listeners?: PluginListenerSetup[]
  }
}
