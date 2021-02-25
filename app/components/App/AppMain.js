import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppLayout from '../../layout/default'
import { RoutedContent } from '../../routes'
import SessionChecker from '../../utils/SessionChecker'
import { Provider } from 'react-redux'
import { configureStore } from '../../redux/store'
import { PersistGate } from 'redux-persist/integration/react'
const basePath = process.env.BASE_PATH || '/'

const AppMain = () => {
  const { store, persistor } = configureStore()
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router basename={basePath}>
          <SessionChecker>
            <AppLayout>
              <RoutedContent />
            </AppLayout>
          </SessionChecker>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default AppMain
