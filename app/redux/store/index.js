/**
 * Redux Store
 */
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducers from '../reducers'
import RootSaga from '../sagas'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const middlewares = [sagaMiddleware]

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet,
}

const persistedReducer = persistReducer(persistConfig, reducers)

export function configureStore(initialState) {
  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancer(applyMiddleware(...middlewares)),
  )

  const persistor = persistStore(store)

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
