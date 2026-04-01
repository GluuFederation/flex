import { configureStore, combineReducers, Tuple } from '@reduxjs/toolkit'
import type { Reducer, UnknownAction } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import appReducers from '../reducers'
import RootSaga from '../sagas'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import reducerRegistry from '../reducers/ReducerRegistry'
import process from 'Plugins/PluginReducersResolver'

type ReducerMap = Record<string, Reducer<unknown, UnknownAction>>

declare global {
  interface Window {
    dsfaStore?: ReturnType<typeof configureStore>
  }
}
declare const module: { hot?: { accept(dep: string, cb: () => void): void } }

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
const middlewares = new Tuple(sagaMiddleware)
const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet,
}
// Preserve initial state for not-yet-loaded reducers
const combine = (reducersObjects: ReducerMap) => {
  const reducerNames = Object.keys(reducersObjects)
  Object.keys(appReducers).forEach((item) => {
    if (reducerNames.indexOf(item) === -1) {
      reducersObjects[item] = ((state: unknown = null) => state) as Reducer<unknown, UnknownAction>
    }
  })
  return combineReducers(reducersObjects)
}
const reducers = combine(reducerRegistry.getReducers())
process()
const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  middleware: () => middlewares,
  reducer: persistedReducer,
})

sagaMiddleware.run(RootSaga)

export function configStore() {
  const persistor = persistStore(store)
  window.dsfaStore = store
  reducerRegistry.setChangeListener((reds) => {
    store.replaceReducer(combine(reds) as unknown as typeof persistedReducer)
  })
  if (module.hot) {
    module.hot.accept('../reducers/index', () => {
      const nextRootReducer = combine(reducerRegistry.getReducers())
      store.replaceReducer(nextRootReducer as unknown as typeof persistedReducer)
    })
  }
  return { store, persistor }
}

export default store
