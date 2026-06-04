import type { ComponentType } from 'react'
import type { Reducer } from '@reduxjs/toolkit'
import type { Saga } from 'redux-saga'
import type { AppStartListening } from '@/redux/listeners'
export type CalledSaga = ReturnType<Saga>
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

export type PluginRoute = {
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
    sagas?: CalledSaga[]
    listeners?: PluginListenerSetup[]
  }
}
