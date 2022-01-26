import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '../../redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import AuthenticatedRouteSelector from './AuthenticatedRouteSelector'
const basePath = process.env.BASE_PATH || '/admin'

const AppMain = () => {
  const { store, persistor } = configureStore()
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router basename={basePath}>
          <AuthenticatedRouteSelector />
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default AppMain
