import { configureStore, combineReducers } from '@reduxjs/toolkit'
import appReducers from '../reducers'
import { listenerMiddleware, startAppListening } from '../listeners'
import '../listeners/sessionListener'
import '../listeners/authListener'
import '../listeners/licenseListener'
import processListeners from 'Plugins/PluginListenersResolver'
import reducerRegistry from '../reducers/ReducerRegistry'
import process from 'Plugins/PluginReducersResolver'
import { installInterceptors } from 'Orval'
import { setHasSessionReader } from '../api/sessionState'
import type { Reducer, UnknownAction } from '@reduxjs/toolkit'
import type { ReducerMap, RootState } from '../types'
import { hmrAccept } from '@/utils/hmr'

type LooseReducerMap = Record<string, Reducer<RootState[keyof RootState], UnknownAction>>

declare global {
  interface Window {
    dsfaStore?: ReturnType<typeof configureStore>
  }
}

const combine = (reducersObjects: ReducerMap) => {
  const merged: LooseReducerMap = { ...(reducersObjects as LooseReducerMap) }
  for (const item of Object.keys(appReducers)) {
    if (!(item in merged)) {
      merged[item] = ((s = {}) => s) as LooseReducerMap[string]
    }
  }
  return combineReducers(merged)
}
const reducers = combine(reducerRegistry.getReducers())
process()

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }).prepend(
      listenerMiddleware.middleware,
    ),
})

const replaceRootReducer = (reducerMap: ReducerMap) => {
  store.replaceReducer(
    combine(reducerMap) as Reducer<object, UnknownAction> as Parameters<
      typeof store.replaceReducer
    >[0],
  )
}

installInterceptors(() => store.getState() as object as RootState, store.dispatch)

setHasSessionReader(
  () => (store.getState() as object as RootState).authReducer?.hasSession ?? false,
)

processListeners(startAppListening)

export const configStore = () => {
  window.dsfaStore = store
  reducerRegistry.setChangeListener(replaceRootReducer)
  hmrAccept('../reducers/index', () => replaceRootReducer(reducerRegistry.getReducers()))
  return { store }
}

export default store
