import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { RootState } from '../types'
import type { AppDispatch } from '../hooks'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>()

export type AppStartListening = typeof startAppListening
