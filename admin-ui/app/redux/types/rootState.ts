import type { Reducer, UnknownAction } from '@reduxjs/toolkit'
import type { CoreAppState, AuthState } from './coreState'
import type { AdminPluginState } from './adminPluginState'
import type { AuthServerPluginState } from './authServerPluginState'

export type RootState = CoreAppState & Partial<AdminPluginState & AuthServerPluginState>

export type ReducerMap = {
  [K in keyof RootState]?: Reducer<RootState[K], UnknownAction>
}

export type ReducerChangeListener = (reducers: ReducerMap) => void

export type AuthReducerState = AuthState

export type SliceState<K extends keyof RootState> = NonNullable<RootState[K]>
