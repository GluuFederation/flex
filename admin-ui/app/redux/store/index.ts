import { configureStore, combineReducers } from '@reduxjs/toolkit'
import appReducers from '../reducers'
import { listenerMiddleware, startAppListening } from '../listeners'
import '../listeners/sessionListener'
import '../listeners/authListener'
import '../listeners/licenseListener'
import processListeners from 'Plugins/PluginListenersResolver'
import { persistStore, persistReducer, type PersistedState } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reducerRegistry from '../reducers/ReducerRegistry'
import process from 'Plugins/PluginReducersResolver'
import { installInterceptors } from 'Orval'
import type { Reducer, UnknownAction } from '@reduxjs/toolkit'
import type { ReducerMap, RootState } from '../types'
import { hmrAccept } from '@/utils/hmr'

type LooseReducerMap = Record<string, Reducer<RootState[keyof RootState], UnknownAction>>

declare global {
  interface Window {
    dsfaStore?: ReturnType<typeof configureStore>
  }
}

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'cedarPermissions',
    'toastReducer',
    'logoutAuditReducer',
    'initReducer',
    'webhookReducer',
    'scopeReducer',
    'licenseReducer',
    'logoutReducer',
  ],
  version: 1,
  migrate: (state: PersistedState) => Promise.resolve(state),
}

const persistMetaPassthrough = ((s = {}) => s) as LooseReducerMap[string]

const combine = (reducersObjects: ReducerMap) => {
  const merged: LooseReducerMap = { ...(reducersObjects as LooseReducerMap) }
  for (const item of Object.keys(appReducers)) {
    if (!(item in merged)) {
      merged[item] = ((s = {}) => s) as LooseReducerMap[string]
    }
  }
  if (!('_persist' in merged)) {
    merged._persist = persistMetaPassthrough
  }
  return combineReducers(merged)
}
const reducers = combine(reducerRegistry.getReducers())
process()
const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }).prepend(
      listenerMiddleware.middleware,
    ),
})

installInterceptors(() => store.getState() as object as RootState, store.dispatch)

processListeners(startAppListening)

export const configStore = () => {
  const persistor = persistStore(store)
  window.dsfaStore = store
  reducerRegistry.setChangeListener((reds) => {
    const nextRootReducer = persistReducer(persistConfig, combine(reds))
    store.replaceReducer(
      nextRootReducer as Reducer<object, UnknownAction> as Parameters<
        typeof store.replaceReducer
      >[0],
    )
  })
  hmrAccept('../reducers/index', () => {
    const nextRootReducer = persistReducer(persistConfig, combine(reducerRegistry.getReducers()))
    store.replaceReducer(
      nextRootReducer as Reducer<object, UnknownAction> as Parameters<
        typeof store.replaceReducer
      >[0],
    )
  })
  return { store, persistor }
}

export default store
