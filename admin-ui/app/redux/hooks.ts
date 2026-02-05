// Redux Typed Hooks with store-inferred types
// Usage: import { useAppDispatch, useAppSelector } from '@/redux/hooks'

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState } from './types'
import store from './store'

// Store-inferred dispatch type
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type { RootState }
