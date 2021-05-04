/**
 * Redux Store
 */
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import appReducers from '../reducers'
import RootSaga from '../sagas'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import reducerRegistry from '../reducers/ReducerRegistry';
import { combineReducers } from 'redux'
import process from '../../../plugins/PluginReducersResolver';
// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const middlewares = [sagaMiddleware]

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet,
}

// Preserve initial state for not-yet-loaded reducers
const combine = (reducers) => {
  
  const reducerNames = Object.keys(reducers);
  Object.keys(appReducers).forEach(item => {
    if (reducerNames.indexOf(item) === -1) {
      reducers[item] = (state = null) => state;
    }
  });
  return combineReducers(reducers);
};

const reducers = combine(reducerRegistry.getReducers());
process();
const persistedReducer = persistReducer(persistConfig, reducers)

export function configureStore(initialState) {
  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancer(applyMiddleware(...middlewares)),
  )

  const persistor = persistStore(store)

  window.dsfaStore = store;
  reducerRegistry.setChangeListener(reducers => {
    store.replaceReducer(combine(reducers));
  });

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

