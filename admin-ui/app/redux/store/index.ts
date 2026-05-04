import { configureStore, combineReducers, Tuple } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import appReducers from '../reducers'
import RootSaga from '../sagas'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import reducerRegistry from '../reducers/ReducerRegistry'
import process from 'Plugins/PluginReducersResolver'
import type { Reducer, UnknownAction } from '@reduxjs/toolkit'
import type { ReducerMap, RootState } from '../types'
import { hmrAccept } from '@/utils/hmr'

type LooseReducerMap = Record<string, Reducer<RootState[keyof RootState], UnknownAction>>

declare global {
  interface Window {
    dsfaStore?: ReturnType<typeof configureStore>
  }
}

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
  const loose = reducersObjects as LooseReducerMap
  const reducerNames = Object.keys(loose)
  Object.keys(appReducers).forEach((item) => {
    if (reducerNames.indexOf(item) === -1) {
      loose[item] = ((s = {}) => s) as LooseReducerMap[string]
    }
  })
  return combineReducers(loose)
}
const reducers = combine(reducerRegistry.getReducers())
process()
const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  middleware: () => middlewares,
  reducer: persistedReducer,
})

sagaMiddleware.run(RootSaga)

export const configStore = () => {
  const persistor = persistStore(store)
  window.dsfaStore = store
  reducerRegistry.setChangeListener((reds) => {
    store.replaceReducer(
      combine(reds) as Reducer<object, UnknownAction> as Parameters<typeof store.replaceReducer>[0],
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
