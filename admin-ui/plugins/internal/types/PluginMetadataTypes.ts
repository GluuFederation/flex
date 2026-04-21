import type { ComponentType } from 'react'
import type { Reducer } from '@reduxjs/toolkit'
import type { Saga } from 'redux-saga'
export type CalledSaga = ReturnType<Saga>

export type PluginMenu = {
  title?: string
  icon?: string
  path?: string
  order?: number
  children?: PluginMenu[]
}

export type PluginRoute = {
  path: string
  component: ComponentType
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
  }
}
