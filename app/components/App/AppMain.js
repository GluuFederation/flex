import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppLayout from '../../layout/default'
import { RoutedContent } from '../../routes'
import AppAuthProvider from '../../utils/AppAuthProvider'
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
          <AppAuthProvider>
            <AppLayout>
              <RoutedContent />
            </AppLayout>
          </AppAuthProvider>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default AppMain
