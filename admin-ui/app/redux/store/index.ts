import { configureStore, combineReducers } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import appReducers from '../reducers'
import RootSaga from '../sagas'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import reducerRegistry from '../reducers/ReducerRegistry'
import process from 'Plugins/PluginReducersResolver'
// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet,
}
// Preserve initial state for not-yet-loaded reducers
const combine: any = (reducersObjects) => {
  const reducerNames = Object.keys(reducersObjects)
  Object.keys(appReducers).forEach((item) => {
    if (reducerNames.indexOf(item) === -1) {
      reducersObjects[item] = (state = null) => state
    }
  })
  return combineReducers(reducersObjects)
}
const reducers = combine(reducerRegistry.getReducers())
process()
const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  middleware: middlewares,
  reducer: persistedReducer
})


declare const module: {
  hot: {
    accept(path: string, callback: () => void): void;
  };
};

let rootReducers

export function configStore() {
  const persistor = persistStore(store)
  window.dsfaStore = store
  reducerRegistry.setChangeListener((reds) => {
    rootReducers = combine(reds)
    store.replaceReducer(combine(reds))
  })
  sagaMiddleware.run(RootSaga)
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/index', () => {
      const nextRootReducer = require('../reducers/index')
      store.replaceReducer(nextRootReducer)
    })
  }
  return { store, persistor }
}
export type RootState = ReturnType<typeof rootReducers>;

