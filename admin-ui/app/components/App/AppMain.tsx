import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configStore } from 'Redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import AuthenticatedRouteSelector from './AuthenticatedRouteSelector'
const basePath = process.env.BASE_PATH || '/admin'

const { store, persistor } = configStore()

const AppMain = () => {
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
