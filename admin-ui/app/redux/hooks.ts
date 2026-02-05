// Typed Redux hooks: useAppDispatch, useAppSelector

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState } from './types'
import store from './store'

export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type { RootState }
